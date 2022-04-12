import { NextApiRequest, NextApiResponse } from "next";
// import SessionService from "@src/services/session.service";
// import { getToken } from "@src/api/utils/callback";
import cookie from 'cookie';

export type TokenGrantResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export type TokenRefreshResponse = Omit<TokenGrantResponse, 'refresh_token'>

type TokenGrantRequest = {
  code: string
  client_secret: string
  client_id: string
  redirect_uri: string
}

type TokenRefreshRequest = {
  refresh_token: string
  client_secret: string
  client_id: string
  redirect_uri: string
}

const tokenRequest = async <T extends 'authorization_code' | 'refresh_token',>(grant_type: T, requestData: T extends 'authorization_code' ? TokenGrantRequest : TokenRefreshRequest ): Promise<T extends 'authorization_code' ? TokenGrantResponse : TokenRefreshResponse> => {
  const body = new URLSearchParams({
    grant_type,
    ...requestData,
  }).toString()

  const headers = { 
    'Content-Type': 'application/x-www-form-urlencoded' 
  }

  const response = await fetch(`https://app.storyblok.com/oauth/token`, {
    method: 'POST',
    headers,
    body,
  })

  if (response.status !== 200) {
    console.error('failed to fetch token', response);
    throw new Error('Unauthorized')
  }
  
  return await response.json() as unknown as (T extends 'authorization_code' ? TokenGrantResponse : TokenRefreshResponse)
}

const refreshToken = (props: TokenRefreshRequest) => tokenRequest('refresh_token', props)
const grantToken = (props: TokenGrantRequest) => tokenRequest('authorization_code', props)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { code, space_id, state } = req.query

  if (typeof code !== 'string') {
    res.status(401).json({ message: 'the code is not a string' })
    return
  }

  console.log('api/auth/callback/callback', req.query);

  const clientSecret = process.env.STORYBLOK_CLIENT_SECRET
  const clientId = process.env.STORYBLOK_CLIENT_ID
  const redirectUri = process.env.STORYBLOK_CLIENT_REDIRECT_URI

  if (typeof clientSecret === 'undefined' || typeof clientId === 'undefined' || typeof redirectUri === 'undefined') {
    console.log('The backend is not configured with a complete set of environmental variables');
    res.status(500).json({ message: 'Internal server error' })
    return
  }

  const tokenResponse = await grantToken({
    code,
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uri: redirectUri
  })

  console.log({ tokenResponse });

  res.setHeader('Set-Cookie', cookie.serialize('storyblokToken', tokenResponse.access_token, {
    path: '/',
    maxAge: tokenResponse.expires_in,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
   }));

  res.redirect('/')
}
