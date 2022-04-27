import {
    createContext,
    FunctionComponent,
    SuspenseProps,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import {getSession, signIn,} from "next-auth/react";
import {CustomAppSession, UserInfo} from "@src/types";
import {Session} from "next-auth";

// When you need to read userinfo, or the token
const SessionContext = createContext<Session | undefined>(undefined)

const CustomAppProvider: FunctionComponent<SuspenseProps> = ({ fallback, children}) => {

    // We do not want to cause re-render when the session is refreshed
    const [session, setSession] = useState<Session | undefined>(undefined)
    const refreshTimer = useRef<number>()

    const refreshSession = useCallback(() => {
        getSession()
            .then(newSession => {
                if (!newSession) {
                    // User is not authenticated\
                    console.debug('getSession() returned null: signing in...')
                    void signIn('storyblok')
                    return
                }
                console.debug('getSession() returned a session, should refresh in', Math.floor(newSession.refreshInMs / 1000 / 60), 'm', Math.floor(newSession.refreshInMs / 1000 % 60), 's')

                setSession(newSession)

                refreshTimer.current = window.setTimeout(refreshSession, newSession.refreshInMs)
            })
            .catch((e) => {
                console.error('Failed to fetch session. Will attempt to sign in again.')
                console.error(e)
                void signIn('storyblok')
            })
    }, [])

    useEffect(() => {
        refreshSession()

        return () => {
            window.clearTimeout(refreshTimer.current)
        }
    }, [])


    if (!session) {
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
        <SessionContext.Provider value={session}>
                {children}
        </SessionContext.Provider>
    )
}

/**
 * IMPORTANT: Does not receive state updates. To do so, subscribe with subscribeRefresh and update the state in the
 * callback function.
 */
const useSession = (): CustomAppSession => {
    const session = useContext(SessionContext)
    if (!session) {
        throw Error(`\`useSession()\` must be wrapped in a <CustomAppProvider />`)
    }

    return session
}

const useUserInfo = (): UserInfo => {
    const session = useSession()
    return session.userInfo
}

const useAccessToken = (): string => {
    const session = useSession()
    return session.accessToken
}

export {useUserInfo, useAccessToken}
export {CustomAppProvider}