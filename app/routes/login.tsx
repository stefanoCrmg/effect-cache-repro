import type * as React from "react"
import { auth } from "~/lib/auth.server"
import { authClient } from "~/lib/createAuthClient"
import type { Route } from "./+types/login"

export const clientLoader = async ({ request }: Route.LoaderArgs) => {
  // const session = await auth.api.getSession({ headers: request.headers })
  // console.log(JSON.stringify(session, null, 2))
}

export function HydrateFallback() {
  return <div>Loading...</div>
}

const LoginPage: React.FC<Route.ComponentProps> = () => {
  // const signIn = () => authClient.signIn.social({ provider: "github", callbackURL: "/login" })
  const signIn = () => authClient.signIn.oauth2({ callbackURL: "/login", providerId: "auth0" })
  const signOut = () => authClient.signOut()

  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = authClient.useSession()

  // React.useEffect(() => {
  //   authClient.listSessions().then((sess) => console.log(JSON.stringify(sess, null, 2)))
  // }, [])

  return (
    <div>
      {isPending && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!session ? (
        <button type="button" onClick={signIn}>
          Sign in with Auth0
        </button>
      ) : (
        <>
          <div>Hello {session.user.id}</div>
          <button type="button" onClick={signOut}>
            Signout
          </button>
        </>
      )}
    </div>
  )
}

export default LoginPage
