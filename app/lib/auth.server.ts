import { betterAuth } from "better-auth"
import { genericOAuth } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "auth0",
          clientId: "jjqcOrMq0KH9y6NRMGsbcAziSX6FyOL6",
          clientSecret: "",
          discoveryUrl: "https://dev-gd73bbaa.us.auth0.com/.well-known/openid-configuration",
          scopes: ["openid", "profile", "email"],
          pkce: true,
        },
      ],
    }),
  ],
})
