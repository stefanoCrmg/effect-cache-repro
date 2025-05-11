import { SqliteClient } from "@effect/sql-sqlite-node"
import { Layer, LogLevel, Logger, ManagedRuntime } from "effect"
import { PokeAPI } from "~/services/PokeAPI"

const SqlClientLive = SqliteClient.layer({
  filename: "data/db.sqlite",
})

const LoggerLayer = Logger.replace(Logger.defaultLogger, Logger.prettyLoggerDefault).pipe(
  Layer.merge(Logger.minimumLogLevel(LogLevel.Debug))
)

const apiLayer = Layer.provide(PokeAPI.Default, LoggerLayer)
const appLayer = Layer.merge(SqlClientLive, apiLayer)

const remixServerRuntime = ManagedRuntime.make(appLayer)

export { remixServerRuntime }
