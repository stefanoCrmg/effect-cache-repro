import { type RouteConfig, route } from "@react-router/dev/routes"

export default [route("/pokemon/:name", "routes/pokemon.tsx")] satisfies RouteConfig
