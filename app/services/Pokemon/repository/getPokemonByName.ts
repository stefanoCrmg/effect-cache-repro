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

export const PokemonServiceLive = Layer.effect(
  PokemonService,
  Effect.gen(function* () {
    const cache = yield* Cache.make({
      capacity: 2,
      timeToLive: Duration.infinity,
      lookup: getPokemonByName,
    }).pipe(Effect.tap(() => Effect.logInfo("Creating PokemonCache")))

    return PokemonService.of({
      getPokemonByName: (name) =>
        pipe(
          cache.get(name),
          Effect.tap(() => cache.cacheStats.pipe(Effect.andThen(Effect.logInfo)))
        ),
    })
  })
).pipe(Layer.tap(() => Effect.logInfo("Creating PokemonServiceLive")))
