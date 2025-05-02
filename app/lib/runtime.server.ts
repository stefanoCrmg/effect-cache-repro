import { SqliteClient } from "@effect/sql-sqlite-node"
import { Layer, LogLevel, Logger, ManagedRuntime } from "effect"
import { PokemonServiceLive } from "~/services/Pokemon/repository/getPokemonByName"

const SqlClientLive = SqliteClient.layer({
  filename: "data/db.sqlite",
})

const LoggerLayer = Logger.replace(Logger.defaultLogger, Logger.prettyLoggerDefault).pipe(
  Layer.merge(Logger.minimumLogLevel(LogLevel.Debug))
)

const apiLayer = Layer.provide(PokemonServiceLive, LoggerLayer)
const appLayer = Layer.merge(SqlClientLive, apiLayer)

const remixServerRuntime = ManagedRuntime.make(appLayer)

export { remixServerRuntime }
