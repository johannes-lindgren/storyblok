import {act, render, screen, waitFor} from "@testing-library/react"
import {CustomAppProvider} from "@src/react/custom-app-provider";

import {getSession, SessionProvider as NASessionProvider, useSession as NAuseSession} from "next-auth/react";
import {Session} from "next-auth";

function nextAuthMockAuthenticated() {
    const expiresInMs = 2000
    const mockSession: Session = {
        expiresInMs,
        expires: new Date(Date.now() + expiresInMs).toISOString(),
        accessToken: 'abcToken123',
        space: {
            id: 0,
            name: 'Mock space'
        }, roles: [{
            name: 'tester'
        }], user: {
            id: '0',
            name: 'Tester'
        }
    }

    const SessionProvider: typeof NASessionProvider = ({children}) => (<>{children}</>)
    const useSession: typeof NAuseSession = () => ({
        status: 'authenticated',
        data: mockSession,
    })

    return {
        __esModule: true,
        SessionProvider,
        signIn: jest.fn(),
        useSession,
        getSession: jest.fn(() => Promise.resolve(mockSession))
    };
}

jest.mock('next-auth/react', nextAuthMockAuthenticated)

it("should render the custom app", async () => {
    await act(async () => void render(<TestApp/>))

    await waitFor(() => {
        expect(screen.getByTestId("content").textContent).toBe("Custom App")
    })
})

it("should refresh the session after it expires", async () => {
    await act(async () => void render(<TestApp/>))

    await new Promise((r) => setTimeout(r, 3 * 2000 + 1000));

    expect(getSession).toHaveBeenCalledTimes(3)
}, 3 * 2000 + 1000 + 1000)

function Fallback() {
    return <div data-testid="content">Loading...</div>
}

function TestApp() {
    return (
        <CustomAppProvider fallback={<Fallback/>}>
            <p data-testid="content">
                Custom App
            </p>
        </CustomAppProvider>
    )
}