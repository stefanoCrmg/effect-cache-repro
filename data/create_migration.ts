import { Args, Command } from "@effect/cli"
import { FileSystem } from "@effect/platform"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Array as A, Console, Effect, Match, Order, Schema, pipe } from "effect"

const readMigrationDirectory = pipe(
  FileSystem.FileSystem,
  Effect.flatMap((_) => _.readDirectory("./migrations"))
)

const MigrationId = Schema.NumberFromString.pipe(Schema.brand("MigrationId"))
const MigrationFileName = Schema.TemplateLiteralParser(MigrationId, "::", Schema.String)
type MigrationFileName = Schema.Schema.Type<typeof MigrationFileName>
const OrderMigrationsById = pipe(
  Order.number,
  Order.mapInput((migration: MigrationFileName) => migration[0])
)

const findLatestMigration = (directoryFiles: string[]) =>
  pipe(
    A.map(directoryFiles, (_) => Schema.decodeUnknownOption(MigrationFileName)(_)),
    A.getSomes,
    A.sortBy(OrderMigrationsById),
    A.last
  )

const genericSQLTemplate = `
import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  yield* sql.onDialectOrElse({
    pg: () => sql\`
      /* TODO: Write your migration here */
    \`,
    orElse: () => sql\`
      /* TODO: Write your migration here */
    \`,
  })
})
`

const createMigration = (migrationName: string) =>
  Effect.gen(function* () {
    const fileSystem = yield* FileSystem.FileSystem
    yield* fileSystem.writeFileString(`./migrations/${migrationName}.ts`, genericSQLTemplate)
  })

const resetCode = "\x1b[0m"

const migrationNameArg = Args.text({ name: "migrationName" })
const command = Command.make("newest-migration", { migrationNameArg }, ({ migrationNameArg }) =>
  Effect.gen(function* () {
    yield* Console.log(`\x1b[32mNewest migration:${resetCode}`)

    const latestMigration = pipe(readMigrationDirectory, Effect.andThen(findLatestMigration))

    yield* pipe(
      latestMigration,
      Effect.matchEffect({
        onSuccess: (latestMigration) => Console.log(latestMigration.join("")),
        onFailure: Match.valueTags({
          NoSuchElementException: () => Console.log("No migrations found"),
          BadArgument: () => Console.log("Bad argument"),
          SystemError: () => Console.log("System error"),
        }),
      })
    )

    const [latestMigrationId, ..._] = yield* latestMigration
    yield* Console.log(`\x1b[32mCreating new migration: ${latestMigrationId + 1}::${migrationNameArg}${resetCode}`)
    yield* createMigration(`${latestMigrationId + 1}::${migrationNameArg}`)
  })
)

const cli = Command.run(command, {
  name: "Create Migration CLI",
  version: "v0.0.1",
})

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
