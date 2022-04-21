import {
    createContext,
    FunctionComponent,
    ReactNode,
    SuspenseProps,
    useCallback,
    useContext,
    useEffect,
    useRef
} from "react";
import {
    getSession,
    SessionProvider as NextAuthSessionProvider,
    signIn,
    useSession as useNextAuthSession,
} from "next-auth/react";
import {Session} from "next-auth";
import {UserInfo} from "@src/types";
import {Subject, Subscriber} from "@src/react/subject";

const RefreshingSessionProvider: FunctionComponent<SuspenseProps> = ({children, fallback}) => (
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
        <WithTokenRefresh session={sessionContext.data}>
            {children}
        </WithTokenRefresh>
    )
}

type ClientContextProviderType = (props: {
    children: ReactNode
    session: Session
}) => JSX.Element

const SessionRefreshListenerContext = createContext<Subject<Session> | undefined>(undefined)

const WithTokenRefresh: ClientContextProviderType = ({
                                                         children
                                                     }) => {
    const refreshTimer = useRef<number>()
    const sessionSubject = useRef(new Subject<Session>())

    const refreshSession = useCallback(async () => {
        // TODO add some negative margin to the timer, so that we do not risk requesting a new session a few ms after it has expired
        // TODO add more negative margin to the timer on the backend, so that we always refresh
        getSession()
            .then(newSession => {
                if (!newSession) {
                    throw Error('Failed to fetch new session')
                }

                // TODO remove
                logSession(newSession)

                sessionSubject.current.next(newSession)

                refreshTimer.current = window.setTimeout(refreshSession, newSession.expiresInMs)
            })
            .catch(() => {
                signIn() // Attempt to sign in again
            })
    }, [])

    useEffect(() => {
        // TODO verify that this solved the below issue
        refreshSession()

        // TODO solve this. Hint: The way to solve it could be to update the Session immediately on useEffect
        // Note: if you edit the code with hot module replacement, you are likely to eventually get a timeout.
        //  Because you need to set the timeout at the moment you fetch the session from the backend.
        //  With hot module replacement, the useEffect() hook will execute without refetching the session from useSession(),
        //  therefore the expiresInMs will be outdated. But this is not a problem in production or development in general.

        // TODO remove console.log
        // logSession(session)

        // refreshTimer.current = window.setTimeout(updateSession, session.expiresInMs);

        return () => {
            window.clearTimeout(refreshTimer.current)
        }
    }, []);

    return (
        <SessionRefreshListenerContext.Provider value={sessionSubject.current}>
            {children}
        </SessionRefreshListenerContext.Provider>
    )
}

const logSession = (session: Session) => {
    console.log('Session', session)
    console.log('The session timeout is', session?.expiresInMs / 1000, 's', '/', session?.expiresInMs / 1000 / 60, 'min')

}

const useSession = () => {
    const sessionSubject = useContext(SessionRefreshListenerContext)
    const session = useNextAuthSession()
    if (session.status !== 'authenticated') {
        throw Error(`useSessionWithRefresh() must be wrapped in a <SessionProvider /> component.`)
    }
    if (!sessionSubject) {
        throw new Error(`useSession() must be wrapped in a <${RefreshingSessionProvider.displayName} />`)
    }
    return {
        session: session.data,
        subscribeRefresh: (listener: Subscriber<Session>) => sessionSubject.subscribe(listener),
        unsubscribeRefresh: (listener: Subscriber<Session>) => sessionSubject.unsubscribe(listener)
    }
}

const useUserInfo = (): UserInfo => {
    const session = useNextAuthSession()
    if (session.status !== 'authenticated') {
        throw Error(`\`useUserInfo()\` must be wrapped in a <${RefreshingSessionProvider.displayName} /> component.`)
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

export {useUserInfo, useSession}
export {RefreshingSessionProvider};