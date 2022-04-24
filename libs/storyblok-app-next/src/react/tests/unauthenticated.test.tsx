import {act, render, screen, waitFor} from "@testing-library/react"
import {CustomAppProvider} from "@src/react/custom-app-provider";
import {SessionContextValue, SessionProvider as NASessionProvider, signIn} from "next-auth/react";
import {UseSessionOptions} from "next-auth/react/types";

function nextAuthMockUnauthenticated() {
    const useSession = <R extends boolean,>(options?: UseSessionOptions<R>): SessionContextValue<R>  => {
        options?.onUnauthenticated && options.onUnauthenticated()
        if(options?.required){
            return {
                status: 'loading',
                data: null
            }
        }
        // @ts-ignore
        return {
            status: 'unauthenticated',
            data: null
        }
    }

    const SessionProvider: typeof NASessionProvider = ({children}) => <>{children}</>

    return {
        __esModule: true,
        // ...jest.requireActual('next-auth/react'),
        signIn: jest.fn(),
        SessionProvider,
        useSession,
        getSession: ()  => Promise.resolve(null),
    };
}

jest.mock('next-auth/react', nextAuthMockUnauthenticated)

it("should fallback if unauthenticated", async () => {
    await act(async () => void render(<TestApp/>))

    await waitFor(() => {
        expect(screen.getByTestId("content").textContent).toBe("Loading...")
    })
})

it("should sign in if unauthenticated", async () => {
    await act(async () => void render(<TestApp/>))

    expect(signIn).toBeCalledWith('storyblok')
})


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