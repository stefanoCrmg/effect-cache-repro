import { FetchHttpClient } from "@effect/platform"
import { Cache, Duration, Effect, pipe } from "effect"
import { getPokemonByName } from "./repository/getPokemonByName"

const PokemonCache = Cache.make({
  capacity: 100,
  timeToLive: Duration.infinity,
  lookup: (name: string) =>
    pipe(
      Effect.logInfo(`${name} not cached. Fetching data.`),
      Effect.andThen(getPokemonByName(name)),
      Effect.provide(FetchHttpClient.layer)
    ),
})

export { PokemonCache }
