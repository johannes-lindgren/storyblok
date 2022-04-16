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
import {useRouter} from "next/router";
import {ContentManagementClient} from "@johannes-lindgren/storyblok-js";
import {Session, User} from "next-auth";
import {Role, Space} from "@src/storyblok-next-sidebar-app/auth/types";

const ClientContext = React.createContext<ContentManagementClient | undefined>(undefined);

const CustomAppProvider: FunctionComponent<SuspenseProps> = (props) => (
    <SessionProvider>
        <WithSessionContext {...props} />
    </SessionProvider>
)

// To protect all routes and automatically log in
const WithSessionContext: FunctionComponent<SuspenseProps> = ({children, fallback}) => {
    const {status} = useSession()
    const router = useRouter()
    useEffect(() => {
        if (window.top == window.self) {
            router.push('https://app.storyblok.com/oauth/app_redirect')
        }
    })
    if (status === 'unauthenticated') {
        signIn('storyblok')
    }
    if (status !== 'authenticated') {
        return <>{fallback}</>
    }
    return (
        <ClientContextProvider>
            {children}
        </ClientContextProvider>
    )
}


const ClientContextProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    // This component is wrapped in another component that already ensures that data is not null
    const session = useNextAuthSession() as {data: Session, status: "authenticated"}

    // We use setTimeout instead of setInterval, because the delay is read from the session
    // We need to use a ref, so that useEffect can clean up the most recent timer.
    const timer = useRef<ReturnType<typeof setTimeout>>()

    // We want to keep the dependency array empty, because we are going to mutate the client's token, in order to
    // preserve the state of the built-in throttling mechanism
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const client = useMemo(() => new ContentManagementClient(session.data.accessToken, session.data.space.id), [session.data.space.id]) // Only initialize once

    // TODO add some negative margin to the timer, so that we do not risk requesting a new session a few ms after it has expired

    function updateSession() {
        getSession()
            .then(newSession => {
                if(!newSession){
                    throw Error('Failed to fetch new session')
                }
                // TODO remove console.log
                console.log('Fetched new session', newSession)
                console.log('Initial timeout is', newSession?.expiresInMs / 1000, 's', '/', newSession?.expiresInMs / 1000 / 60, 'min')

                // storyblok-js-client doesn't allow us to update tokens for the content management API; only content delivery token
                client.setAccessToken(newSession.accessToken)
                timer.current = setTimeout(updateSession, newSession?.expiresInMs)
            })
            .catch(() => {
                signIn() // Attempt to sign in again
            })
    }

    useEffect(() => {
        // TODO remove console.log
        console.log('Initial timeout is', session.data?.expiresInMs / 1000, 's', '/', session.data?.expiresInMs / 1000 / 60, 'min')

        timer.current = setTimeout(updateSession, session.data.expiresInMs);

        return () => timer.current && clearTimeout(timer.current);
    }, []);

    if (session.status !== 'authenticated') {
        throw Error(`The useSession() hook should only be used in components that are within a CustomAppContext. The current login status is '${session.status}'`)
    }

    // TODO remove console.log
    console.log({session})

    // customAppContext.client.setToken(session.data.accessToken)
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