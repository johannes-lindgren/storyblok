import * as React from "react";
import {FunctionComponent, PropsWithChildren, SuspenseProps, useContext, useEffect, useMemo} from "react";
import {SessionProvider, signIn, useSession as useNextAuthSession, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {ContentManagementClient} from "@src/storyblok-js/content-management-client";
import {User} from "@src/custom-app/next-auth/types";

type CustomAppContext = {
    user: User,
    client: ContentManagementClient
}

const CustomAppContext = React.createContext<CustomAppContext | undefined>(undefined);

const CustomAppProvider: FunctionComponent<SuspenseProps> = (props) => (
    <SessionProvider>
        <WithAutomaticRedirect {...props} />
    </SessionProvider>
)

// To protect all routes and automatically log in
const WithAutomaticRedirect: FunctionComponent<SuspenseProps> = ({children, fallback}) => {
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
    if (session.status !== 'authenticated') {
        throw Error(`The useSession() hook should only be used in components that are within a CustomAppContext. The current login status is '${session.status}'`)
    }
    const customAppContext = useMemo(() => ({
        user: session.data.user,
        client: new ContentManagementClient(session.data.accessToken)
    }), []) // Only initialize once
    if(customAppContext.client.client.getToken() !== session.data.accessToken){
        console.log('Updating token!')
    }
    customAppContext.client.setToken(session.data.accessToken)
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
    return session.data.user
}

export {CustomAppProvider, useClient, useUser}