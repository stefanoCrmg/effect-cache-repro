import { SqliteClient } from "@effect/sql-sqlite-node"

export const SqlLayer = SqliteClient.layer({
  filename: "./data/db.sqlite",
})
