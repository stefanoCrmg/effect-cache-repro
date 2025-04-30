import { PgClient } from "@effect/sql-pg"
import { Layer, LogLevel, Logger, ManagedRuntime, Redacted } from "effect"
import { PokemonServiceLive } from "~/services/Pokemon/repository/getPokemonByName"

const url = Redacted.make("postgresql://postgres:STwOhWFzJSIzaToYowronzsfcTKQcTMw@hopper.proxy.rlwy.net:48776/railway")

export const SqlLive = PgClient.layer({
  url,
})

const LoggerLayer = Logger.replace(Logger.defaultLogger, Logger.prettyLoggerDefault).pipe(
  Layer.merge(Logger.minimumLogLevel(LogLevel.Debug))
)

const sqlLayer = Layer.provide(SqlLive, LoggerLayer)
const apiLayer = Layer.provide(PokemonServiceLive, LoggerLayer)
const appLayer = Layer.merge(sqlLayer, apiLayer)

const remixServerRuntime = ManagedRuntime.make(appLayer)

export { remixServerRuntime }
