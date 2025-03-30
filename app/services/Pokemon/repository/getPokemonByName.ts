import { HttpClient, HttpClientResponse } from "@effect/platform"
import type { HttpClientError } from "@effect/platform/HttpClientError"
import { Effect, pipe } from "effect"
import { Schema } from "effect"
import type { ParseError } from "effect/ParseResult"

export class PokemonByNameResponse extends Schema.Class<PokemonByNameResponse>("PokemonByNameResponse")({
  sprites: Schema.Struct({
    front_default: Schema.String,
    front_shiny: Schema.String,
    other: Schema.Struct({
      "official-artwork": Schema.Struct({
        front_default: Schema.String,
        front_shiny: Schema.String,
      }),
    }).pipe(Schema.rename({ "official-artwork": "officialArtwork" })),
  }),
}) {}

export const getPokemonByName = (
  name: string
): Effect.Effect<PokemonByNameResponse, HttpClientError | ParseError, HttpClient.HttpClient> =>
  pipe(
    HttpClient.get(`https://pokeapi.co/api/v2/pokemon/${name}`),
    Effect.andThen(HttpClientResponse.schemaBodyJson(PokemonByNameResponse)),
    Effect.scoped
  )
