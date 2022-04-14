import * as React from "react";
import {FunctionComponent, PropsWithChildren, SuspenseProps, useContext, useEffect, useMemo, useRef} from "react";
import {getSession, SessionProvider, signIn, useSession as useNextAuthSession, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {ContentManagementClient} from "@src/storyblok-js/content-management-client";
import {User} from "@src/custom-app/auth-api/types";

type CustomAppContext = {
    user: User,
    client: ContentManagementClient
}

const CustomAppContext = React.createContext<CustomAppContext | undefined>(undefined);

const CustomAppProvider: FunctionComponent<SuspenseProps> = (props) => (
    <SessionProvider>
        <WithSessionContext {...props} />
    </SessionProvider>
)

// const CustomAppProvider: FunctionComponent<SuspenseProps> = WithSessionContext

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
        <CustomAppContextProvider>
            {children}
        </CustomAppContextProvider>
    )
}


const CustomAppContextProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const session = useNextAuthSession()
    console.log({session})
    const timer = useRef<ReturnType<typeof setTimeout>>()
    const customAppContext = useMemo(() => ({
        user: session.data.user,
        client: new ContentManagementClient(session.data.accessToken)
    }), []) // Only initialize once
    function updateSession() {
        getSession()
            .then(newSession => {
                if(!newSession){
                    throw Error('Failed to fetch new session')
                }
                console.log('Fetched new session', newSession)
                console.log('New timeout', session.data?.expiresIn)
                customAppContext.client.setToken(newSession?.accessToken)
                timer.current = setTimeout(updateSession, newSession?.expiresIn * 1000)
            })
            .catch(e => {
                console.error(e)
                signIn() // Attempt to sign in again
            })
    }
    useEffect(() => {
        if(!session.data){
            return // TODO
        }
        console.log('Initial timeout is', session.data?.expiresIn)
        if(!session.data.expiresIn){
            throw new Error('session.data.expiresIn is required')
        }
        timer.current = setTimeout(updateSession, session.data.expiresIn  * 1000);
        return () => timer.current && clearTimeout(timer.current);
    }, []);

    if (session.status !== 'authenticated') {
        throw Error(`The useSession() hook should only be used in components that are within a CustomAppContext. The current login status is '${session.status}'`)
    }

    // customAppContext.client.setToken(session.data.accessToken)
    return (
        <CustomAppContext.Provider value={customAppContext}>
            {children}
        </CustomAppContext.Provider>
    )
}

const useClient = (): ContentManagementClient => {
    const val = useContext(CustomAppContext)
    return val.client
}

const useUser = (): User => {
    const session = useNextAuthSession()
    if (session.status !== 'authenticated') {
        throw Error(`The useSession() hook should only be used in components that are within a CustomAppContext. The current login status is '${session.status}'`)
    }
    console.log({session})
    return session.data.user
}

export {CustomAppProvider, useClient, useUser}