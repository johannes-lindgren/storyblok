type TokenRequestData = {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    error?: string
}

type TokenRefreshResponse = Omit<TokenRequestData, 'refresh_token'>

type TokenRequestPayload = {
    grant_type: 'authorization_code'
    code: string
    client_secret: string
    client_id: string
    redirect_uri: string
}

type TokenRefreshPayload = {
    grant_type: 'refresh_token'
    refresh_token: string
    client_secret: string
    client_id: string
}

const sendTokenRequest = async <T extends TokenRequestPayload | TokenRefreshPayload,>(requestData: T): Promise<T extends TokenRequestPayload ? TokenRequestData : TokenRefreshResponse> => {
    const response = await fetch(`https://app.storyblok.com/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(requestData).toString(),
    })

    if (response.status !== 200) {
        console.error('failed to fetch token', response);
        throw new Error('Unauthorized')
    }

    return await response.json() as unknown as (T extends TokenRequestPayload ? TokenRequestData : TokenRefreshResponse)
}

export {sendTokenRequest}