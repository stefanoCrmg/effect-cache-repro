import { setupServer } from "msw/node"
import { mockPokeAPI } from "~/services/mocks"

export const mswServer = setupServer(...mockPokeAPI)
