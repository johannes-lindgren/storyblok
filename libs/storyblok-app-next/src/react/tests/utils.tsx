import {FunctionComponent, useEffect, useState} from "react";
import {CustomAppProvider, useAccessToken, useUserInfo} from "@src/react";

// TODO let the build ignore this folder!

const Fallback = () => <div data-testid="content" id="fallback">Loading...</div>

const TestCustomApp: FunctionComponent = () => {
    const accessToken = useAccessToken()
    const {user, roles, space} = useUserInfo()
    const [tokenCount, setTokenCount] = useState(0)

    useEffect(() => {
        setTokenCount(prevVal => prevVal + 1)
    }, [accessToken])

    return (
        <div data-testid="content" id="custom-app">
            <dl>
                <dt>User name</dt>
                <dd data-testid="user.friendly_name">{user.friendly_name}</dd>
                <dt>Space name</dt>
                <dd data-testid="space.name">{space.name}</dd>
                <dt>Current access token</dt>
                <dd data-testid="accessToken">{accessToken}</dd>
                <dt>Refresh count</dt>
                <dd data-testid="tokenCount">{tokenCount}</dd>
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