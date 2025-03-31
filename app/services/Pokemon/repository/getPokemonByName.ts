import { FetchHttpClient, HttpClient, HttpClientResponse } from "@effect/platform"
import type { HttpClientError } from "@effect/platform/HttpClientError"
import { Cache, Context, Duration, Effect, Layer, Schema, pipe } from "effect"
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
): Effect.Effect<PokemonByNameResponse, HttpClientError | ParseError, never> =>
  pipe(
    Effect.logInfo(`Fetching pokemon by name: ${name}`),
    Effect.andThen(HttpClient.get(`https://pokeapi.co/api/v2/pokemon/${name}`)),
    Effect.andThen(HttpClientResponse.schemaBodyJson(PokemonByNameResponse)),
    Effect.scoped,
    Effect.provide(FetchHttpClient.layer)
  )

export class PokemonService extends Context.Tag("PokemonService")<
  PokemonService,
  {
    readonly getPokemonByName: (
      name: string
    ) => Effect.Effect<PokemonByNameResponse, HttpClientError | ParseError, never>
  }
>() {}

const PokemonCache = Cache.make({
  capacity: 100,
  timeToLive: Duration.infinity,
  lookup: (name: string) => getPokemonByName(name),
})

export const PokemonServiceLive = Layer.succeed(
  PokemonService,
  PokemonService.of({
    getPokemonByName: (name) =>
      pipe(
        PokemonCache,
        Effect.andThen((cache) => cache.get(name))
      ),
  })
)
