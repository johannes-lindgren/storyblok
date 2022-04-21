<div align="center">
	<h1 align="center">@johannes-lindgren/storyblok-app-next</h1>
  <p align="center">
    A typed JavaScript library to integrate your apps within <a href="https://www.storyblok.com" target="_blank">Storyblok</a>.
  </p>
  <br />
</div>

`storyblok-app-next` is a library that allows you to seamlessly integrate your Next.js applications with Storyblok.

With very little configuration:

* All routes are guarded
* End-users are automatically be signed in
* Access tokens are automatically refreshed.

## Getting Started

Read [this introduction to custom apps](https://www.storyblok.com/docs/plugins/custom-application).

### Create a Tunnel to localhost:3000

For development, we recommend using [ngrok](https://ngrok.com/) for creating tunnels to your locally hosted app.

Sign up for an account on [ngrok](https://ngrok.com/) and sign in.

[Follow the instructions on your ngrok dashboard](https://dashboard.ngrok.com/get-started/setup) to install the client
application on your machine, connect to your account and fire it up.

### Register an app

To create an app, you need to be registered as a partner to Storyblok.

Sign in to https://app.storyblok.com, navigate to _Partner portal_ > _Apps_, and click <button>+New App</button>.

Provide a name and id, and select _Sidebar_ as the App Type.

In the settings for your app, navigate to the _OAuth 2_ menu and provide the following details:

* URL to your app: _https://[your-grok-uuid].ngrok.io_
* OAuth2 callback URL: _https://[your-grok-uuid].ngrok.io/api/auth/callback/storyblok_

_[your-grok-uuid]_ should be substituted with the id of your running ngrok session. When you close and restart ngrok,
you're assigned a new uuid that you need to provide to the Storyblok app.

### Using a Template

The easiest way to get started is to clone
the [example app](https://github.com/johannes-lindgren/storyblok/tree/main/examples/nextjs-sidebar-app) and follow the
instructions in the `README.md` file.

### Adding to an Existing Next.js Project

To add NextAuth.js to an existing Next.js project, install the following packages:

```shell
yarn add next-auth
yarn add ... // TODO @johannes-lindgren/storyblok-app-next
```

Create a file `[...nextauth].js` in `pages/api/auth`.

`pages/api/auth/[...nextauth].js`:

```typescript
import {makeAppAuthOptions} from "@johannes-lindgren/storyblok-app-next/dist/api";
import NextAuth from "next-auth";

export default NextAuth(makeAppAuthOptions())
```

This contains the dynamic route handler for [NextAuth.js](https://next-auth.js.org/).

In your `_app.ts` file, wrap your page component in an `CustomAppProvider` component.

`_app.ts`:

```typescript jsx
const MyApp = (props) => (
    <CustomAppProvider>
        <Component {...props} />
    </CustomAppProvider>
)

export default MyApp
```

### Environmental Variables

Rename `.env.local.example` to `.env.local` and add values for all environmental variables:

* STORYBLOK_CLIENT_ID - Can be found in the app settings.
* STORYBLOK_CLIENT_SECRET - Can be found in the app settings.
* NEXTAUTH_URL - Same as the url to your app; `https://[grok-uuid].ngrok.io`
* STORYBLOK_JWT_SECRET - a random string. Can be generated with
     ```shell
    openssl rand -base64 32
    ```

## Usage

In your pages, use the hooks `useUserInfo()` and `useContentManagementClient()`.

`pages/index.ts`:

```typescript jsx
export default function IndexPage() {
    const {user, roles, space} = useUserInfo()
    const client = useContentManagementClient()

    return (
        <div>
            <p>Signed in as <em>{user.name}</em> on the <em>{space.name}</em> space</p>
            <p>Your roles are: </p>
            <ul>
                {roles.map(role => (<li key={role.name}>{role.name}</li>))}
            </ul>
        </div>
    )
}
```

That's it!

## Other Options

CustomAppProvider

* fallback

### Custom Client

If you prefer to use your own content management client, you need to ensure that the client's access token is refreshed when the session is refreshed. You should wrap you application within your own provider component that provides an instance of your client. Inside the client, subscribe to session refresh events with the `useSession()` hook:

See `src/react/content-management-provider` for an example of an implementation.