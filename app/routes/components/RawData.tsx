import { useRouteLoaderData } from "react-router"
import type { loader as PokemonLoader } from "../pokemon"

export const RawData: React.FC = () => {
  const t = useRouteLoaderData<typeof PokemonLoader>("routes/pokemon")
  return <pre>{JSON.stringify(t, null, 2)}</pre>
}
