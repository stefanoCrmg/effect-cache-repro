import { fileURLToPath } from "node:url"
import { NodeContext } from "@effect/platform-node"
import { SqliteMigrator } from "@effect/sql-sqlite-node"
import { Effect, Layer, Logger, ManagedRuntime, pipe } from "effect"
import { SqlLayer } from "~/services/SQL/Sql"

const MigratorLive = SqliteMigrator.layer({
  table: "migrations_log",
  loader: SqliteMigrator.fromFileSystem(fileURLToPath(new URL("./migrations", import.meta.url))),
}).pipe(Layer.provide(NodeContext.layer))

const migrationsRuntime = pipe(
  MigratorLive,
  Layer.provideMerge(SqlLayer),
  Layer.provideMerge(Logger.pretty),
  ManagedRuntime.make
)

Effect.logInfo("Running migrations...").pipe(migrationsRuntime.runFork)

const forkedEffect = Effect.fork(Effect.logInfo("wtf!!!;"))

const a = pipe(Effect.succeed("Hello!"), Effect.tap(forkedEffect))
