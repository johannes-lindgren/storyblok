import {Session} from "next-auth";
import * as React from "react";
import {FunctionComponent, PropsWithChildren, useContext, useRef} from "react";

type SessionListener = (session: Session) => void

class SessionSubscribeList {

    private listeners: Set<SessionListener>

    constructor() {
        this.listeners = new Set<SessionListener>()
    }

    publishNewSession(session: Session) {
        this.listeners.forEach(listener => listener(session))
    }

    subscribe(listener: SessionListener) {
        console.log('Subscribing new listener...')
        console.log(`There are ${listener.length} listeners`)
        this.listeners.add(listener)
    }

    unsubscribe(listener: SessionListener) {
        this.listeners.delete(listener)
    }
}

const SessionRefreshListenerContext = React.createContext<SessionSubscribeList | undefined>(undefined)

/**
 * Provides a subscription list for subscribing and publishing token refresh events
 * @param children
 */
const SessionRefreshListenerProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const subscribeList = useRef(new SessionSubscribeList())
    return (
        <SessionRefreshListenerContext.Provider value={subscribeList.current}>
            {children}
        </SessionRefreshListenerContext.Provider>
    )
}

const usePublishSession = (): (newSession: Session) => void => {
    const sessionRefreshListener = useContext(SessionRefreshListenerContext)
    if (!sessionRefreshListener) {
        throw new Error(`usePublishSession() must be wrapped in a <${SessionRefreshListenerProvider.displayName} />`)
    }
    return sessionRefreshListener.publishNewSession
}

export {usePublishSession, SessionRefreshListenerProvider, SessionListener, SessionRefreshListenerContext, SessionSubscribeList}