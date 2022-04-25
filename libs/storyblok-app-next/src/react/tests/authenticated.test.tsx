import {
    act, render,
    screen
} from "@testing-library/react"
import {getSession} from "next-auth/react";

import {TestApp} from "@src/react/tests/utils";

const expiresInMs = 899 * 1000

function nextAuthMockAuthenticated() {
    const getMockSession: typeof getSession = async () => ({
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
    })

    return {
        __esModule: true,
        signIn: jest.fn(),
        getSession: jest.fn(getMockSession)
    };
}

jest.mock('next-auth/react', nextAuthMockAuthenticated)

afterEach(() => {
    jest.clearAllMocks();
});

jest.useFakeTimers();

it("should render the fallback", async () => {
    act(() => {
        render(<TestApp/>)
    })
    expect(screen.getByTestId("content").id).toBe("fallback")
})

it("should render the custom app", async () => {
    act(() => {
        render(<TestApp/>)
    })

    // Wait for the promises to resolve
    await act(async () => {
        await Promise.resolve()
    })

    expect(screen.getByTestId("content").id).toBe("custom-app")
})

it("should fetch a session when app initially opens", async () => {
    act(() => {
        render(<TestApp/>)
    })

    expect(getSession).toHaveBeenCalledTimes(1)
})

it("should refresh the session after it expires", async () => {
    const expectedRefreshCount = 500
    act(() => {
        render(<TestApp/>)
    })
    await act(async () => {
        jest.advanceTimersByTime(expiresInMs / 2);
        await Promise.resolve();
        for (let i = 0; i < expectedRefreshCount - 1; i++) {
            jest.advanceTimersByTime(expiresInMs);
            await Promise.resolve();
        }
    })
    expect(getSession).toHaveBeenCalledTimes(expectedRefreshCount)
})