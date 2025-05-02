import { FetchHttpClient, HttpClient, HttpClientResponse } from "@effect/platform"
import type { HttpClientError } from "@effect/platform/HttpClientError"
import { Cache, Duration, Effect, Schema, pipe } from "effect"
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

const authNSpan = pipe(
  Effect.succeed("Hello!"),
  Effect.delay(Duration.millis(100)),
  Effect.withSpan("authN", {
    attributes: {
      name: "authN",
    },
  })
)
const microserviceSpan = pipe(
  Effect.succeed("Hello!"),
  Effect.delay(Duration.millis(100)),
  Effect.withSpan("microservice", {
    attributes: {
      name: "microservice",
    },
  }),
  Effect.tap(authNSpan)
)

export const getPokemonByName = (
  name: string
): Effect.Effect<PokemonByNameResponse, HttpClientError | ParseError, HttpClient.HttpClient> =>
  pipe(
    Effect.logInfo(`Retrieving ${name} data from PokeAPI`),
    Effect.tap(Effect.fork(microserviceSpan)),
    Effect.andThen(HttpClient.get(`https://pokeapi.co/api/v2/pokemon/${name}`)),
    Effect.andThen(HttpClientResponse.schemaBodyJson(PokemonByNameResponse)),
    Effect.withSpan("PokeAPI.getPokemonByName", {
      attributes: {
        name,
      },
    }),
    Effect.scoped
  )

const PokemonByNameCache = pipe(
  Cache.make({
    capacity: 40,
    timeToLive: Duration.infinity,
    lookup: getPokemonByName,
  }),
  Effect.tap(Effect.logDebug("Creating PokemonCache"))
)

export class PokeAPI extends Effect.Service<PokeAPI>()("Service/PokeAPI", {
  accessors: true,
  effect: Effect.gen(function* () {
    const pokemonByNameCache = yield* PokemonByNameCache
    return {
      getPokemonByName: (name: string) => pipe(pokemonByNameCache.get(name)),
    }
  }),
  dependencies: [FetchHttpClient.layer],
}) {}
