import { Layer, LogLevel, Logger, ManagedRuntime } from "effect"
import { PokemonServiceLive } from "~/services/Pokemon/repository/getPokemonByName"

const LoggerLayer = Logger.replace(Logger.defaultLogger, Logger.prettyLoggerDefault).pipe(
  Layer.merge(Logger.minimumLogLevel(LogLevel.Debug))
)

const appLayer = Layer.provide(PokemonServiceLive, LoggerLayer)
const remixRuntime = ManagedRuntime.make(appLayer)

export { remixRuntime }
