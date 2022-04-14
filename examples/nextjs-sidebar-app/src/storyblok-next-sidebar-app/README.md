# storyblok-next-custom-app

## Getting Started

Read [this article](https://www.storyblok.com/docs/plugins/custom-application) for how to create a custom app, then
follow the instructions below.

### Create an app

Create a new app and add the following values to your app settings:

* URL to your app: https://[grok-uuid].ngrok.io
* OAuth2 callback URL: https://[grok-uuid].ngrok.io/api/auth/callback/storyblok

### New Project

The easiest way to get started is to clone
the [example app](https://github.com/johannes-lindgren/storyblok/tree/main/examples/nextjs-sidebar-app) and follow the
instructions in the `README.md` file.

### Existing Project

To add NextAuth.js to a project create a file called `[...nextauth].js` in `/pages/api/auth`. This contains the dynamic
route handler for [NextAuth.js](https://next-auth.js.org/).

```typescript
import {StoryblokAuth} from "@johannes-lindgren/storyblok-next-sidebar-app";

export default StoryblokAuth()
```

Rename `.env.local.example` to `.env.local` and add values for all environmental variables:

* STORYBLOK_CLIENT_ID - Can be found in the app settings.
* STORYBLOK_CLIENT_SECRET - Can be found in the app settings.
* STORYBLOK_CLIENT_REDIRECT_URI - Same as in your app
  settings; `https://[grok-uuid].ngrok.io/api/auth/callback/storyblok`
* STORYBLOK_JWT_SECRET - a random string. Can be generated with
     ```shell
    openssl rand -base64 32
    ```

In your `_app.ts` file, wrap your component in an `CustomAppProvider` component:

```typescript jsx
...
<CustomAppProvider>
    <Component {...pageProps} />
</CustomAppProvider>
...
```

### Usage

Create an index page `/pages/index.ts`

```typescript jsx
export default function IndexPage() {
    const user = useUser()
    const roles = useRoles()
    const space = useSpace()

    // Use the client to manage content as the currently signed-in user 
    const client = useClient()
  
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

That's it! Users will be signed in automatically, all routes are protected, and the access token will refresh automatically.