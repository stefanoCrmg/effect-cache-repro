import { nodeProfilingIntegration } from "@sentry/profiling-node"
import * as Sentry from "@sentry/react-router"

Sentry.init({
  dsn: "https://01aa03f56d60e0231601c4ff66297d66@o4509241950470144.ingest.de.sentry.io/4509241952895056",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  profilesSampleRate: 1.0, // profile every transaction
})
