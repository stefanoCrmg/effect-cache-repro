import { Array as A, Arbitrary, FastCheck, Schema, pipe } from "effect"
import { http, HttpResponse } from "msw"
import { PokemonByNameResponse } from "./PokeAPI"

const arbPokemon = Arbitrary.make(PokemonByNameResponse)

export const mockPokeAPI = [
  http.get("https://pokeapi.co/api/v2/pokemon/*", () => {
    const genPokemons = FastCheck.sample(arbPokemon, 10) as A.NonEmptyArray<PokemonByNameResponse>
    const pickOne = pipe(A.headNonEmpty(genPokemons), Schema.encodeSync(PokemonByNameResponse))

    return HttpResponse.json(pickOne)
  }),
]
