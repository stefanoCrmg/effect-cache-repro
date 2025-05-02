import { type RouteConfig, route } from "@react-router/dev/routes"

export default [
  route("/pokemon/:name", "routes/pokemon.tsx"),
  route("/example-page", "routes/example-page.tsx"),
] satisfies RouteConfig
