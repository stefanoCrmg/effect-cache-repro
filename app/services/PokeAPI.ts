import { FetchHttpClient, HttpClient, HttpClientResponse } from "@effect/platform"
import { Cache, Duration, Effect, Schema, pipe } from "effect"

export class PokemonByNameResponse extends Schema.Class<PokemonByNameResponse>("PokemonByNameResponse")({
  sprites: Schema.Struct({
    front_default: Schema.URL,
    front_shiny: Schema.URL,
    other: Schema.Struct({
      "official-artwork": Schema.Struct({
        front_default: Schema.URL,
        front_shiny: Schema.URL,
      }),
    }).pipe(Schema.rename({ "official-artwork": "officialArtwork" })),
  }),
}) {}

class GetPokemonByName extends Effect.Service<GetPokemonByName>()("Service/GetPokemonByName", {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient

    const getPokemonByName = Effect.fn("PokeAPI.getByName")((name: string) =>
      pipe(
        Effect.logInfo(`Retrieving ${name} data from PokeAPI`),
        Effect.andThen(httpClient.get(`https://pokeapi.co/api/v2/pokemon/${name}`)),
        Effect.andThen(HttpClientResponse.schemaBodyJson(PokemonByNameResponse)),
        Effect.scoped
      )
    )

    const pokemonByNameCache = yield* pipe(
      Cache.make({
        capacity: 40,
        timeToLive: Duration.infinity,
        lookup: getPokemonByName,
      }),
      Effect.tap(Effect.logDebug("PokemonByNameCache created."))
    )

    return {
      getPokemonByName: (name: string) => pokemonByNameCache.get(name),
    } as const
  }),
}) {}

export class PokeAPI extends Effect.Service<PokeAPI>()("Service/PokeAPI", {
  dependencies: [GetPokemonByName.Default],
  effect: Effect.gen(function* () {
    const { getPokemonByName } = yield* GetPokemonByName

    return { getPokemonByName } as const
  }),
}) {}
