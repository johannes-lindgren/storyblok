import {act, render, screen, waitFor} from "@testing-library/react"
import {getSession, signIn} from "next-auth/react";
import {TestApp} from "@src/react/tests/utils";

function nextAuthMockUnauthenticated() {
    const getMockSession: typeof getSession = async () => null
    return {
        __esModule: true,
        signIn: jest.fn(),
        getSession: jest.fn(getMockSession)
    };
}

jest.mock('next-auth/react', nextAuthMockUnauthenticated)

it("should fallback if unauthenticated", async () => {
    act(() => {
        render(<TestApp/>)
    })

    await waitFor(() => {
        expect(screen.getByTestId("content").id).toBe("fallback")
    })
})

it("should sign in if unauthenticated", async () => {
    act(() => {
        render(<TestApp/>)
    })

    expect(signIn).toBeCalledWith('storyblok')
})
