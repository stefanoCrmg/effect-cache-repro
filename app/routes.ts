import { type RouteConfig, route } from "@react-router/dev/routes"

export default [
  route("/pokemon/:name", "routes/pokemon.tsx"),
  route("/api/auth/*", "routes/api/auth.ts"),
  route("/login", "routes/login.tsx"),
] satisfies RouteConfig
