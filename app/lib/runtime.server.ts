import { DevTools } from "@effect/experimental"
import { NodeSocket } from "@effect/platform-node"
import { Layer, Logger, ManagedRuntime } from "effect"
import { PokemonServiceLive } from "~/services/Pokemon/repository/getPokemonByName"

const LoggerLayer = Logger.replace(Logger.defaultLogger, Logger.prettyLoggerDefault)
const DevToolsLive = DevTools.layerWebSocket().pipe(Layer.provide(NodeSocket.layerWebSocketConstructor))
const appLayer = Layer.mergeAll(LoggerLayer, DevToolsLive, PokemonServiceLive)

const remixRuntime = ManagedRuntime.make(appLayer)

export { remixRuntime }
