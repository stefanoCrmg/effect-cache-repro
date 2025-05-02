import { PassThrough } from "node:stream"
import { createReadableStreamFromReadable } from "@react-router/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node"
import { getMetaTagTransformer, wrapSentryHandleRequest } from "@sentry/react-router"
import * as Sentry from "@sentry/react-router"
import { isbot } from "isbot"
import type { RenderToPipeableStreamOptions } from "react-dom/server"
import { renderToPipeableStream } from "react-dom/server"
import type { AppLoadContext, EntryContext } from "react-router"
import { ServerRouter } from "react-router"

Sentry.init({
  dsn: "???",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  profilesSampleRate: 1.0, // profile every transaction
})

export const streamTimeout = 5_000

const handleRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext
  // If you have middleware enabled:
  // loadContext: unstable_RouterContextProvider
) => {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const userAgent = request.headers.get("user-agent")

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? "onAllReady" : "onShellReady"

    const { pipe, abort } = renderToPipeableStream(<ServerRouter context={routerContext} url={request.url} />, {
      [readyOption]() {
        shellRendered = true
        const body = new PassThrough()
        const stream = createReadableStreamFromReadable(body)

        responseHeaders.set("Content-Type", "text/html")

        resolve(
          new Response(stream, {
            headers: responseHeaders,
            status: responseStatusCode,
          })
        )

        // this enables distributed tracing between client and server
        pipe(getMetaTagTransformer(body))
      },
      onShellError(error: unknown) {
        reject(error)
      },
      onError(error: unknown) {
        // biome-ignore lint: <explanation>
        // biome-ignore lint/suspicious/noDebugger: <explanation>
        responseStatusCode = 500
        // Log streaming rendering errors from inside the shell.  Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          console.error(error)
        }
      },
    })

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    setTimeout(abort, streamTimeout + 1000)
  })
}

// wrap the default export
export default wrapSentryHandleRequest(handleRequest)
