import { HttpServerResponse } from "@effect/platform"
import { SqlClient, SqlSchema } from "@effect/sql"
import { Effect, Schema, pipe } from "effect"
import { remixServerRuntime } from "~/lib/runtime.server"
import type { Route } from "./+types/db"

const User = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
})

const program = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const getUsers = SqlSchema.findAll({
    Result: User,
    Request: Schema.Void,
    execute: () => sql`SELECT id, name FROM "effect-pg-dev"`,
  })
  // const GetById = yield* SqlResolver.ordered("GetUserById", {
  //   Result: Schema.Array(User),
  //   Request: Schema.Undefined,
  //   execute: () => sql`SELECT * FROM "effect-pg-dev"`,
  // })

  return yield* getUsers()
})

const ServerResponse = Schema.Struct({
  message: Schema.Array(User),
})

export function loader(_: Route.LoaderArgs) {
  return pipe(
    program,
    Effect.andThen((_) => HttpServerResponse.schemaJson(ServerResponse)({ message: _ })),
    Effect.map(HttpServerResponse.toWeb),
    Effect.provide(remixServerRuntime),
    Effect.runPromise
  )
}

const insert = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient
  const insertUser = SqlSchema.void({
    Request: Schema.String,
    execute: (name) => sql`INSERT INTO "effect-pg-dev" (name) VALUES (${name})`,
  })
  return yield* insertUser("John")
})

export function action(_: Route.ActionArgs) {
  return pipe(
    insert,
    Effect.andThen(HttpServerResponse.empty()),
    Effect.map(HttpServerResponse.toWeb),
    Effect.provide(remixServerRuntime),
    Effect.runPromise
  )
}
