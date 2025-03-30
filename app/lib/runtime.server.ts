import { DevTools } from "@effect/experimental"
import { NodeSocket } from "@effect/platform-node"
import { Layer, Logger, ManagedRuntime } from "effect"

const LoggerLayer = Logger.replace(Logger.defaultLogger, Logger.prettyLoggerDefault)
const DevToolsLive = DevTools.layerWebSocket().pipe(Layer.provide(NodeSocket.layerWebSocketConstructor))
const appLayer = Layer.mergeAll(LoggerLayer, DevToolsLive)

export const remixRuntime = ManagedRuntime.make(appLayer)
