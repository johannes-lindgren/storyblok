import {FunctionComponent} from "react";
import {CustomAppProvider, useSession, useUserInfo} from "@src/react";

const Fallback = () => <div data-testid="content" id="fallback">Loading...</div>

const TestCustomApp: FunctionComponent = () => {
    const {session} = useSession()
    const {user, roles, space} = useUserInfo()

    return (
        <div data-testid="content" id="custom-app">
            <p>Hello {user.friendly_name} from the `{space.name}` space. Your roles
                are: {roles.map(role => role.name).join(', ')}</p>
            <p>The fake access token is: {session.accessToken}</p>
        </div>
    )
}

export function TestApp() {
    return (
        <CustomAppProvider fallback={<Fallback />}>
            <TestCustomApp/>
        </CustomAppProvider>
    )
}