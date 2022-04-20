import {FunctionComponent, ReactNode, SuspenseProps, useCallback, useContext, useEffect, useRef} from "react";
import {
    getSession,
    SessionProvider as NextAuthSessionProvider,
    signIn,
    useSession as useNextAuthSession,
} from "next-auth/react";
import {Session} from "next-auth";
import {UserInfo} from "@src/types";
import {ContentManagementClientProvider} from "@src/react/content-management-context";
import {
    SessionListener,
    SessionRefreshListenerContext,
    SessionRefreshListenerProvider,
    usePublishSession
} from "@src/react/session-listener-context";

// type UpdateToken<Client> = (client: Client, token: string) => void
//
// type MakeClientFactory<Client> = (session: Session) => () => Client


// storyblok-js-client doesn't allow us to update tokens for the content management API; only content delivery token
// const defaultMakeClient: MakeClientFactory<ContentManagementClient> = (session) => () => new ContentManagementClient(session.accessToken, session.space.id)
// const defaultUpdateToken: UpdateToken<ContentManagementClient> = (client, token: string) => client.setAccessToken(token)

// const isAppEmbedded = () => window.top != window.self

// TODO this would not be a good idea for tools. It works the same as sidebar apps, but it doesn't make sense without the content context.
//  add property where this feature can be enabled/disabled
// useEffect(() => {
//     if (!isAppEmbedded()) {
//         console.log('The app should be embedded within the Storyblok app, redirecting...')
//         window.location.assign('https://app.storyblok.com/oauth/app_redirect')
//     }
// }, [])

const CustomAppProvider: FunctionComponent<SuspenseProps> = ({children, fallback}) => (
    // NextAuthSessionProvider provides the session to the AuthGuard
    <NextAuthSessionProvider>
            <AuthGuard fallback={fallback}>
                {children}
            </AuthGuard>
    </NextAuthSessionProvider>
)

// Guarantees that the child component has access to a session.
const AuthGuard: FunctionComponent<SuspenseProps> = ({children, fallback}) => {
    const sessionContext = useNextAuthSession()

    if (sessionContext.status === 'unauthenticated') {
        signIn('storyblok')
    }
    if (sessionContext.status !== 'authenticated') {
        return (
            <div style={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {fallback}
            </div>
        )
    }

    return (
        <SessionRefreshListenerProvider>
            <WithTokenRefresh session={sessionContext.data}>
                {children}
            </WithTokenRefresh>
        </SessionRefreshListenerProvider>
    )
}

type ClientContextProviderType = (props: {
    children: ReactNode
    session: Session
    // makeClient: MakeClientFactory<Client>
    // onTokenRefresh: UpdateToken<Client>
}) => JSX.Element

const WithTokenRefresh: ClientContextProviderType = ({
                                                              children,
                                                              session
                                                          }) => {
    const refreshTimer = useRef<number>()
    const publishNewSession = usePublishSession()

    const updateSession = useCallback(async () => {
        // TODO add some negative margin to the timer, so that we do not risk requesting a new session a few ms after it has expired
        // TODO add more negative margin to the timer on the backend, so that we always refresh
        getSession()
            .then(newSession => {
                if (!newSession) {
                    throw Error('Failed to fetch new session')
                }

                // TODO remove console.log
                console.log('Fetched new session')
                console.log('The new session new session', newSession)
                console.log('The new session timeout is', newSession?.expiresInMs / 1000, 's', '/', newSession?.expiresInMs / 1000 / 60, 'min')

                publishNewSession(newSession)

                refreshTimer.current = window.setTimeout(updateSession, newSession.expiresInMs)
            })
            .catch(() => {
                signIn() // Attempt to sign in again
            })
    }, [])

    useEffect(() => {
        // TODO solve this
        // Note: if you edit the code with hot module replacement, you are likely to eventually get a timeout.
        //  Because you need to set the timeout at the moment you fetch the session from the backend.
        //  With hot module replacement, the useEffect() hook will execute without refetching the session from useSession(),
        //  therefore the expiresInMs will be outdated. But this is not a problem in production.

        // TODO remove console.log
        console.log('Using existing session')
        console.log('The initial session is', session)
        console.log('The initial timeout is', session.expiresInMs / 1000, 's', '/', session.expiresInMs / 1000 / 60, 'min')

        refreshTimer.current = window.setTimeout(updateSession, session.expiresInMs);

        return () => {
            window.clearTimeout(refreshTimer.current)
        }
    }, []);

    return (
        <ContentManagementClientProvider>
            {children}
        </ContentManagementClientProvider>
    )
}

const useSessionWithRefresh = () => {
    const subscribeList = useContext(SessionRefreshListenerContext)
    const session = useNextAuthSession()
    if (session.status !== 'authenticated') {
        throw Error(`useSessionWithRefresh() must be wrapped in a <SessionProvider /> component.`)
    }
    if (!subscribeList) {
        throw new Error(`useSessionWithRefresh() must be wrapped in a <${SessionRefreshListenerProvider.displayName} />`)
    }
    return {
        session: session.data,
        subscribeSessionRefresh: (listener: SessionListener) => subscribeList.subscribe(listener),
        unsubscribeSessionRefresh: (listener: SessionListener) => subscribeList.unsubscribe(listener)
    }
}

const useUserInfo = (): UserInfo => {
    const session = useNextAuthSession()
    if (session.status !== 'authenticated') {
        throw Error(`\`useUserInfo()\` must be wrapped in a <${CustomAppProvider.displayName} /> component.`)
    }
    return {
        user: {
            id: parseInt(session.data.user.id),
            friendly_name: session.data.user.name,
        },
        roles: session.data.roles,
        space: session.data.space,
    }
}

export {CustomAppProvider, useUserInfo, useSessionWithRefresh}