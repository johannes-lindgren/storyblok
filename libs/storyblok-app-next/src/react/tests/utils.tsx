import {FunctionComponent, useEffect, useRef, useState} from "react";
import {CustomAppProvider, Subscriber, useSession, useUserInfo} from "@src/react";
import {CustomAppSession} from "@src/types";

const Fallback = () => <div data-testid="content" id="fallback">Loading...</div>

const TestCustomApp: FunctionComponent = () => {
    const {session, subscribeRefresh, unsubscribeRefresh} = useSession()
    const {user, roles, space} = useUserInfo()
    const [accessToken, setAccessToken] = useState<string>(session.accessToken)
    const subscriber = useRef<undefined | Subscriber<CustomAppSession>>(undefined)
    useEffect(() => {
        subscriber.current = subscribeRefresh((newSession) => setAccessToken(newSession.accessToken))
        return () => {
            if(subscriber.current){
                unsubscribeRefresh(subscriber.current)
            }
        }
    }, [])

    return (
        <div data-testid="content" id="custom-app">
            <dl>
                <dt>User name</dt>
                <dd data-testid="user.friendly_name">{user.friendly_name}</dd>
                <dt>Space name</dt>
                <dd data-testid="space.name">{space.name}</dd>
                <dt>Initial access token</dt>
                <dd data-testid="initialAccessToken">{session.accessToken}</dd>
                <dt>Current access token</dt>
                <dd data-testid="currentAccessToken">{accessToken}</dd>
            </dl>
            <ul data-testid="roles">
                {roles.map(role => (
                  <li key={role.name}>{role.name}</li>
                ))}
            </ul>
        </div>
    )
}

export function TestApp() {
    return (
        <CustomAppProvider fallback={<Fallback/>}>
            <TestCustomApp/>
        </CustomAppProvider>
    )
}