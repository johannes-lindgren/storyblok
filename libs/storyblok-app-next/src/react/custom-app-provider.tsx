import {
    createContext,
    FunctionComponent,
    SuspenseProps,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {getSession, signIn,} from "next-auth/react";
import {CustomAppSession, UserInfo} from "@src/types";
import {Subject, Subscriber} from "@src/react/subject";
import {Session} from "next-auth";

// When you need to read userinfo, or the token
const SessionContext = createContext<Session | undefined>(undefined)

// When you need to subscribe to session/token refresh
const SessionSubjectContext = createContext<Subject<CustomAppSession> | undefined>(undefined)

const CustomAppProvider: FunctionComponent<SuspenseProps> = ({ fallback, children}) => {

    // We do not want to cause re-render when the session is refreshed
    const session = useRef<Session | undefined>(undefined)
    const sessionSubject = useRef(new Subject<CustomAppSession>())
    const refreshTimer = useRef<number>()

    // We want to cause re-render when the initial session is fetched
    const [isLoading, setLoading] = useState<boolean>(session.current === undefined)

    const refreshSession = useCallback(() => {
        console.log('getSession()')
        getSession()
            .then(newSession => {
                if (!newSession) {
                    // User is not authenticated\
                    console.log('getSession() returned null: signing in...')
                    void signIn('storyblok')
                    return
                }
                console.log('getSession() returned a session, expires in', newSession.refreshInMs / 1000, 's')

                session.current = newSession
                sessionSubject.current.next(newSession)

                refreshTimer.current = window.setTimeout(refreshSession, newSession.refreshInMs)

                // if this was the initial call to getSession -> Re-render with the child
                setLoading(false)
            })
            .catch((e) => {
                // TODO remove console log
                console.error(e)
                void signIn('storyblok')
            })
    }, [])

    useEffect(() => {
        refreshSession()

        return () => {
            console.log('Cleaning upp timer')
            window.clearTimeout(refreshTimer.current)
        }
    }, [])


    if (isLoading) {
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
        <SessionContext.Provider value={session.current}>
            <SessionSubjectContext.Provider value={sessionSubject.current}>
                {children}
            </SessionSubjectContext.Provider>
        </SessionContext.Provider>
    )
}

type SessionData = {
    session: CustomAppSession
    subscribeRefresh: (subscriber: Subscriber<CustomAppSession>) => Subscriber<CustomAppSession>
    unsubscribeRefresh: (subscriber: Subscriber<CustomAppSession>) => void
}

const useSession = (): SessionData => {
    const sessionSubject = useContext(SessionSubjectContext)
    const session = useContext(SessionContext)
    if (!session || !sessionSubject) {
        throw Error(`\`useSession()\` must be wrapped in a <CustomAppProvider />`)
    }
    const subscribeUnsubscribe: Pick<SessionData, 'subscribeRefresh' | 'unsubscribeRefresh'> = useMemo(() => ({
        subscribeRefresh: (subscriber: Subscriber<CustomAppSession>) => sessionSubject.subscribe(subscriber),
        unsubscribeRefresh: (subscriber: Subscriber<CustomAppSession>) => sessionSubject.unsubscribe(subscriber)
    }), [sessionSubject])

    return useMemo(() => ({
        session: session as CustomAppSession,
        ...subscribeUnsubscribe,
    }), [sessionSubject, session.data])
}

const useUserInfo = (): UserInfo => {
    const session = useContext(SessionContext)
    if (session === undefined) {
        throw Error(`\`useUserInfo()\` must be wrapped in a <CustomAppProvider />`)
    }
    return session.userInfo
}

export {useUserInfo, useSession}
export {CustomAppProvider}