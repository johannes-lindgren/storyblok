import * as React from "react";
import {FunctionComponent, SuspenseProps, useEffect} from "react";
import {SessionProvider, signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";

export const CustomAppProvider: FunctionComponent<SuspenseProps> = (props) => (
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
    return <>
        {children}
    </>
}