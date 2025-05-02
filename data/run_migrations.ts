import { fileURLToPath } from "node:url"
import { NodeContext } from "@effect/platform-node"
import { SqliteMigrator } from "@effect/sql-sqlite-node"
import { Effect, Layer, Logger, ManagedRuntime, pipe } from "effect"
import { SqlLayer } from "~/services/SQL/Sql"

const MigratorLive = pipe(
  SqliteMigrator.layer({
    table: "migrations_log",
    loader: SqliteMigrator.fromFileSystem(fileURLToPath(new URL("./migrations", import.meta.url))),
  }),
  Layer.provideMerge(SqlLayer),
  Layer.provide(NodeContext.layer)
)

const migrationsRuntime = pipe(MigratorLive, Layer.provideMerge(Logger.pretty), ManagedRuntime.make)

Effect.logInfo("Running migrations...").pipe(migrationsRuntime.runFork)
