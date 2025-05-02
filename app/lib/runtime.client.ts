import { WebSdk } from "@effect/opentelemetry"
import { SentrySpanProcessor } from "@sentry/opentelemetry"
import { Layer, LogLevel, Logger, ManagedRuntime, pipe } from "effect"
import { PokeAPI } from "~/services/PokeAPI"

const sentrySpanProcessor = new SentrySpanProcessor()

const WebSdkLive = WebSdk.layer(() => ({
  resource: { serviceName: "web-client" },
  spanProcessor: sentrySpanProcessor,
}))

const LoggerLayer = Logger.replace(Logger.defaultLogger, Logger.prettyLoggerDefault).pipe(
  Layer.merge(Logger.minimumLogLevel(LogLevel.Debug))
)

const apiLayer = pipe(Layer.provide(PokeAPI.Default, LoggerLayer), Layer.provideMerge(WebSdkLive))

const remixClientRuntime = ManagedRuntime.make(apiLayer)

export { remixClientRuntime }
