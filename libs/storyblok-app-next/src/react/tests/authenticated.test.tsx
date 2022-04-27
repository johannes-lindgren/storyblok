import {
    act, render,
    screen, waitFor
} from "@testing-library/react"
import {getSession} from "next-auth/react";

import {TestApp} from "@src/react/tests/utils";
import {UserInfo} from "@src/types";

const refreshInMs = 15 * 60 * 1000 // 15 min, not important exactly how much

const mockUserInfo: UserInfo = {
    user: {
        friendly_name: 'Tester',
        id: 0,
    },
    roles: [{
        name: 'tester'
    }, {
        name: 'test-author'
    }],
    space: {
        id: 0,
        name: 'Mock space'
    },
}

const advanceTimeInSteps = async (steps: number, stepsMs: number) => {
    for (let i = 0; i < steps; i++) {
        jest.advanceTimersByTime(stepsMs);
        await Promise.resolve();
    }
}

function randomString(len: number) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

function nextAuthMockAuthenticated() {
    const createMockSession: typeof getSession = async () => ({
        refreshInMs,
        expires: new Date(Date.now() + refreshInMs).toISOString(),
        accessToken: randomString(48),
        userInfo: mockUserInfo,
    })

    return {
        __esModule: true,
        signIn: jest.fn(),
        getSession: jest.fn(createMockSession)
    };
}

jest.mock('next-auth/react', nextAuthMockAuthenticated)

afterEach(() => {
    jest.clearAllMocks();
});

jest.useFakeTimers();


describe('<CustomAppProvider />', () => {

    it("should render the fallback when initially opened", async () => {
        act(() => {
            render(<TestApp/>)
        })
        expect(screen.getByTestId("content").id).toBe("fallback")
    })

    it("should fetch a session when the app initially opens", async () => {
        act(() => {
            render(<TestApp/>)
        })

        expect(getSession).toHaveBeenCalledTimes(1)
    })

    it("should render the custom app after initially fetching a session", async () => {
        act(() => {
            render(<TestApp/>)
        })

        // Wait for the promises to resolve
        await act(async () => {
            await Promise.resolve()
        })


        expect(screen.getByTestId("content").id).toBe("custom-app")
    })

    it("should repeatedly refresh the session after it expires", async () => {
        const expectedRefreshCount = 500
        act(() => {
            render(<TestApp/>)
        })
        await act(async () => {
            await advanceTimeInSteps(1, refreshInMs / 2)
            await advanceTimeInSteps(expectedRefreshCount - 1, refreshInMs)
        })
        expect(getSession).toHaveBeenCalledTimes(expectedRefreshCount)
        screen.debug()
    })

})

describe('useUserInfo()', () => {
    it('should return user data', async () => {
        act(() => {
            render(<TestApp/>)
        })

        await waitFor(() => {
            expect(screen.getByTestId('user.friendly_name').textContent).toBe(mockUserInfo.user.friendly_name)
        })
    })

    it('should return space data', async () => {
        act(() => {
            render(<TestApp/>)
        })

        await waitFor(() => {
            expect(screen.getByTestId('space.name').textContent).toBe(mockUserInfo.space.name)
        })
    })

    it('should return role data', async () => {
        act(() => {
            render(<TestApp/>)
        })

        await waitFor(() => {
            for (const role of mockUserInfo.roles) {
                expect(screen.getByTestId('roles').textContent).toContain(role.name)
            }
        })
    })
})

describe('useSession()', () => {
    it('should return the initial access token', async () => {
        act(() => {
            render(<TestApp/>)
        })

        await waitFor(() => {
            expect(screen.getByTestId('accessToken').textContent).not.toBe("")
        })
    })

    it('should let clients subscribe to token refresh', async () => {
        act(() => {
            render(<TestApp/>)
        })

        await act(async () => {
            await advanceTimeInSteps(1, refreshInMs / 2)
        })

        const initialAccessToken = screen.getByTestId('accessToken').textContent

        await act(async () => {
            await advanceTimeInSteps(1, refreshInMs)
        })

        expect(screen.getByTestId('accessToken').textContent).not.toBe(initialAccessToken)
    })
})