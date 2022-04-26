import {makeAppAuthOptions} from "../make-app-auth-options";
import {JWT} from "next-auth/jwt";
import {Session, User} from "next-auth";
import { sendTokenRequest} from "../storyblok-oauth-api";
import {StoryblokAccount, UserInfo} from "../../types";

const expiresIn = 899

function randomString(len: number) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

jest.mock('../storyblok-oauth-api', () => {
    // @ts-ignore
    const sendTokenRequestMock: typeof sendTokenRequest = async (requestData) => {
        if (requestData.grant_type === 'refresh_token') {
            console.log('Granting token')
            return {
                expires_in: expiresIn,
                token_type: 'bearer',
                access_token: randomString(36),
                refresh_token: randomString(36),
            }
        } else {
            console.log('Refreshing token')
            return {
                expires_in: expiresIn,
                token_type: 'bearer',
                access_token: randomString(36),
            }
        }
    }

    return {
        __esModule: true,
        sendTokenRequest: jest.fn(sendTokenRequestMock),
    }
})

// Allow us to mock process.env within the tests
const env = process.env
beforeAll(() => {
    jest.resetModules()
    process.env = {...env}
})
afterAll(() => {
    process.env = env
    jest.clearAllMocks();
})

function resetEnv() {
    process.env.STORYBLOK_CLIENT_ID = undefined
    process.env.STORYBLOK_CLIENT_SECRET = undefined
    process.env.STORYBLOK_JWT_SECRET = undefined
    process.env.NEXTAUTH_URL = undefined
}

const makeMockOptions = () => makeAppAuthOptions({
    clientId: 'fakeClientId',
    clientSecret: 'fakeClientSecret',
    jwtSecret: 'fakeJwtSecret'
})

const makeMockInitialSession = (): Session => ({
    expires: new Date().toISOString(),
} as Session)

const mockUser: User = {
    name: 'Tester',
    id: '0'
}

const makeMockJWT = (accessTokenExpires: number): JWT => ({
    userInfo: {
        user: {
            friendly_name: 'Tester',
            id: 0,
        },
        roles: [{name: 'admin'}],
        space: {
            name: 'Mock Space',
            id: 0,
        },
    },
    accessToken: randomString(36),
    refreshToken: randomString(36),
    accessTokenExpires,
    name: mockUser.name,
    sub: mockUser.id
})

const jwtAboutToExpire = () => makeMockJWT(Date.now() + 5 * 1000) // Expires in 5 seconds
const jwtNew = () => makeMockJWT(Date.now() + expiresIn * 1000) // newly issued token

const account: StoryblokAccount = {
    provider: 'storyblok',
    type: 'oauth',
    providerAccountId: '113692',
    access_token: randomString(36),
    refresh_token: randomString(36),
    token_type: 'bearer',
    expires_at: Date.now() + expiresIn,
    userId: '',
}

const userInfo: UserInfo = {
    user: { id: 113692, friendly_name: 'Johannes Lindgren' },
    space: { id: 152949, name: 'Johannes Dev' },
    roles: [{
        name: 'tester'
    } ]
}

const user: User = { id: '113692', name: 'Johannes Lindgren', email: undefined }

describe('the make NextAuth options factory', () => {

    it("should require options if environment variables are not set", () => {
        resetEnv()

        process.env.NEXTAUTH_URL = 'https://fakeurl.com'
        const makeOptions1 = () => makeAppAuthOptions({
            clientSecret: 'fakeClientSecret',
            jwtSecret: 'fakeJwtSecret',
        })
        const makeOptions2 = () => makeAppAuthOptions({
            clientId: 'fakeClientId',
            jwtSecret: 'fakeJwtSecret',
        })
        const makeOptions3 = () => makeAppAuthOptions({
            clientId: 'fakeClientId',
            clientSecret: 'fakeClientSecret',
        })
        const makeOptions4 = () => makeAppAuthOptions({
            clientId: 'fakeClientId',
            clientSecret: 'fakeClientSecret',
            jwtSecret: 'fakeJwtSecret',
        })


        expect(makeOptions1).toThrow(Error);
        expect(makeOptions2).toThrow(Error);
        expect(makeOptions3).toThrow(Error);
        expect(makeOptions4).not.toThrow(Error)
    })

    it("should require environmental variable NEXTAUTH_URL", () => {
        resetEnv()
        process.env.NEXTAUTH_URL = undefined

        expect(makeMockOptions).toThrow(Error);

        process.env.NEXTAUTH_URL = 'https://fakeurl.com'
        expect(makeMockOptions).not.toThrow(Error);
    })
})

describe('the NextAuth JWT token API', () => {

    it("should request a token on initial sign in", async () => {
        const options = makeMockOptions()

        const initialSignInContext = {
            // Next Auth actually passes the profile as the JWT token on the initial sign in
            token: mockUser as unknown as JWT,
            account,
            user,
            profile: userInfo
        }
        const jwt = await options.callbacks.jwt(initialSignInContext)

        expect(typeof jwt.accessToken).toBe('string')
        expect(typeof jwt.refreshToken).toBe('string')
        expect(typeof jwt.accessTokenExpires).toBe('number')
    })

    it("should not refresh or request a token if the token is not about to expire", async () => {
        const options = makeMockOptions()
        const validToken: JWT = jwtNew()
        const jwt = await options.callbacks.jwt({
            token: validToken
        })
        expect(sendTokenRequest).not.toHaveBeenCalled()
        expect(jwt.accessToken).toBe(validToken.accessToken)
    })

    it("should refresh the token some time before it expires", async () => {
        const options = makeMockOptions()
        const tokenAboutToExpire: JWT = jwtAboutToExpire()
        const jwt = await options.callbacks.jwt({
            token: tokenAboutToExpire
        })
        expect(sendTokenRequest).toHaveBeenCalled()
        expect(jwt.refreshToken).not.toBe(tokenAboutToExpire.accessToken)
    })

})

describe('the NextAuth session API', () => {

    it("should include the time until expiration in the session", async () => {
        const options = makeMockOptions()
        const token: JWT = jwtNew()
        const session = await options.callbacks.session({
            token: token,
            user,
            session: makeMockInitialSession(), // This is what the initial session that is received looks like
        })

        expect(session.expiresInMs).toBeDefined()
    })

    it("should inform the client to refresh the token before the token expires", async () => {
        const options = makeMockOptions()
        const expiresInMs = expiresIn * 1000 // ms until Storyblok expires the token
        const token: JWT = makeMockJWT(Date.now() + expiresInMs)
        const session = await options.callbacks.session({
            token: token,
            user,
            session: makeMockInitialSession(),
        })

        // The time difference between when the client perceives the token to expire, vs when it actually does
        const marginMs = expiresInMs - session.expiresInMs

        expect(marginMs).toBeGreaterThan(10 * 1000)
    })

    it("should include the issued access token", async () => {
        const options = makeMockOptions()
        const token: JWT = jwtNew() // Expires in 1 second
        const session = await options.callbacks.session({
            token: token,
            user,
            session: makeMockInitialSession(), // This is what the initial session that is received looks like
        })

        expect(session.accessToken).toBe(token.accessToken)
    })

    it("should include user info in the session", async () => {
        const options = makeMockOptions()
        const token: JWT = jwtNew()
        const session = await options.callbacks.session({
            token: token,
            user,
            session: makeMockInitialSession(), // This is what the initial session that is received looks like
        })

        expect(session.user).toBeDefined()
        expect(session.roles).toBeDefined()
        expect(session.space).toBeDefined()
    })
})