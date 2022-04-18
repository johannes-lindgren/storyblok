import * as React from "react";
import {FunctionComponent, PropsWithChildren, SuspenseProps, useContext, useEffect, useMemo, useRef} from "react";
import {
    getSession,
    SessionContextValue,
    SessionProvider,
    signIn,
    useSession as useNextAuthSession,
    useSession
} from "next-auth/react";
import {ContentManagementClient} from "@johannes-lindgren/storyblok-js";
import {Session, User} from "next-auth";
import {Role, Space} from "@src/types";

const ClientContext = React.createContext<ContentManagementClient | undefined>(undefined);

const CustomAppProvider: FunctionComponent<SuspenseProps> = ({children,fallback}) => (
    <SessionProvider>
        <WithSessionContext fallback={fallback}>
            {children}
        </WithSessionContext>
    </SessionProvider>
)

// To protect all routes and automatically log in
const WithSessionContext: FunctionComponent<SuspenseProps> = ({children, fallback}) => {
    const session = useSession()

    useEffect(() => {
        if (window.top == window.self) {
            console.log('Redirecting')
            window.location.assign('https://app.storyblok.com/oauth/app_redirect')
        }
    }, [])

    if (session.status === 'unauthenticated') {
        signIn('storyblok')
    }
    if (session.status !== 'authenticated') {
        return <>{fallback}</>
    }
    return (
        <ClientContextProvider session={session.data}>
            {children}
        </ClientContextProvider>
    )
}


const ClientContextProvider: FunctionComponent<PropsWithChildren<{session: Session}>> = ({children, session}) => {
    // We use setTimeout instead of setInterval, because the delay is read from the session
    // We need to use a ref, so that useEffect can clean up the most recent timer.
    const timer = useRef<number>()

    // We want to keep the dependency array empty, because we are going to mutate the client's token, in order to
    // preserve the state of the built-in throttling mechanism
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const client = useMemo(() => new ContentManagementClient(session.accessToken, session.space.id), [session.space.id]) // Only initialize once

    // TODO add some negative margin to the timer, so that we do not risk requesting a new session a few ms after it has expired

    function updateSession() {
        getSession()
            .then(newSession => {
                if(!newSession){
                    throw Error('Failed to fetch new session')
                }
                // TODO remove console.log
                console.log('Fetched new session')
                console.log('The new session new session', newSession)
                console.log('The new session timeout is', newSession?.expiresInMs / 1000, 's', '/', newSession?.expiresInMs / 1000 / 60, 'min')

                // storyblok-js-client doesn't allow us to update tokens for the content management API; only content delivery token
                client.setAccessToken(newSession.accessToken)
                timer.current = window.setTimeout(updateSession, newSession.expiresInMs)
            })
            .catch(() => {
                signIn() // Attempt to sign in again
            })
    }

    useEffect(() => {
        // Note: if you edit the code with hot module replacement, you are likely to eventually get a timeout.
        //  Because you need to set the timeout at the moment you fetch the session from the backend.
        //  With hot module replacement, the useEffect() hook will execute without refetching the session from useSession(),
        //  therefore the expiresInMs will be outdated. But this is not a problem in production.

        // TODO remove console.log
        console.log('Using existing session')
        console.log('The initial session is', session)
        console.log('The initial timeout is', session.expiresInMs / 1000, 's', '/', session.expiresInMs / 1000 / 60, 'min')

        timer.current = window.setTimeout(updateSession, session.expiresInMs);

        return () => {
            window.clearTimeout(timer.current)
        }
    }, []);

    if (session.status !== 'authenticated') {
        throw Error(`The useSession() hook should only be used in components that are within a CustomAppContext. The current login status is '${session.status}'`)
    }

    return (
        <ClientContext.Provider value={client}>
            {children}
        </ClientContext.Provider>
    )
}

const useSessionContext = () => {
    const session = useNextAuthSession()
    if(!isAuthenticated(session)){
        throw Error(`The hook should only be used in components that are within a CustomAppContext. The current login status is '${session.status}'`)
    }
    return session
}

const useClient = (): ContentManagementClient => {
    const client = useContext(ClientContext)
    if(!client){
        throw Error(`The hook should only be used in components that are within a CustomAppContext. The current client is undefined`)
    }
    return client
}

const useUser = (): User => {
    const session = useSessionContext()
    return session.data.user
}
const useSpace = (): Space => {
    const session = useSessionContext()
    return session.data.space
}
const useRoles = (): Role[] => {
    const session = useSessionContext()
    return session.data.roles
}

const isAuthenticated = (session: SessionContextValue): session is {data: Session, status: "authenticated"} => session.status === 'authenticated'

export {CustomAppProvider, useClient, useUser, useSpace, useRoles}