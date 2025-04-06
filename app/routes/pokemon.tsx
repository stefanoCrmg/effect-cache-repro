import { Effect, pipe } from "effect"
import type * as React from "react"
import { remixRuntime } from "~/lib/runtime.server"
import { PokemonService } from "~/services/Pokemon/repository/getPokemonByName"
import type { Route } from "./+types/pokemon"
import { RawData } from "./components/RawData"
import * as styles from "./pokemon.css"

export const loader = ({ params }: Route.LoaderArgs) =>
  pipe(
    PokemonService,
    Effect.tap(() => Effect.logInfo("Requesting pokemon by name", params.name)),
    Effect.andThen((_) => _.getPokemonByName(params.name)),
    remixRuntime.runPromise
  )

export function HydrateFallback() {
  return <div>Loading...</div>
}

const PokemonPage: React.FC<Route.ComponentProps> = ({ params, loaderData }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{params.name}</h1>
      <div className={styles.card}>
        <div className={styles.spriteContainer}>
          <div className={styles.spriteWrapper}>
            <img
              src={loaderData.sprites.front_default}
              alt={`${params.name} default sprite`}
              className={styles.spriteImage}
            />
            <p className={styles.spriteLabel}>Default</p>
          </div>
          <div className={styles.spriteWrapper}>
            <img
              src={loaderData.sprites.front_shiny}
              alt={`${params.name} shiny sprite`}
              className={styles.spriteImage}
            />
            <p className={styles.spriteLabel}>Shiny</p>
          </div>
          <div className={styles.spriteWrapper}>
            <img
              src={loaderData.sprites.other.officialArtwork.front_default}
              alt={`${params.name} official artwork`}
              className={styles.spriteImage}
            />
          </div>
        </div>
        <details className={styles.detailsSection}>
          <summary className={styles.detailsSummary}>View Raw Data</summary>
          <RawData />
        </details>
      </div>
    </div>
  )
}

export default PokemonPage
