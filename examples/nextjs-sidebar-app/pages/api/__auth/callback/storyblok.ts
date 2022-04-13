import {NextApiRequest, NextApiResponse} from "next";
import {getUser, requestToken, setStoryblokSessionCookie} from "@src/custom-app";
import {getState} from "@src/custom-app/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { code, space_id, state: stateFromQuery } = req.query
  const state = getState()

  if(state !== stateFromQuery){
    console.error('Invalid state parameter')
    console.error('Correct state', state)
    console.error('State from request', stateFromQuery)
    res.status(401).json({message: "Invalid state parameter."})
    return
  }

  if (typeof code !== 'string') {
    res.status(401).json({ message: 'the code is not a string' })
    return
  }

  const clientSecret = process.env.STORYBLOK_CLIENT_SECRET
  const clientId = process.env.STORYBLOK_CLIENT_ID
  const redirectUri = process.env.STORYBLOK_CLIENT_REDIRECT_URI

  if (typeof clientSecret === 'undefined' || typeof clientId === 'undefined' || typeof redirectUri === 'undefined') {
    console.log('The backend is not configured with a complete set of environmental variables');
    res.status(500).json({ message: 'Internal server error' })
    return
  }

  const tokenResponse = await requestToken({
    code,
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uri: redirectUri
  })

  // console.log({tokenResponse})

  const userInfo = await getUser(tokenResponse.access_token)
  const sbSession = {...tokenResponse, ...userInfo }
  setStoryblokSessionCookie(res, sbSession)

  res.redirect('/')
}

