import {NextApiRequest, NextApiResponse} from "next";
import {getState} from "@src/custom-app/api";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log('signin/storyblok');
  // if(req.method === 'GET') {
  //   req.method = 'POST'
  // }
  // hand(req, res)

  const client_id = process.env.STORYBLOK_CLIENT_ID as string
  const redirect_uri = process.env.STORYBLOK_CLIENT_REDIRECT_URI as string
  // const code_verifier = process.env.NEXTAUTH_SECRET as string;
  // const code_challenge = base64Encode(
  //     SHA256(code_verifier).toString()
  // )
  const scopes = [
    'read_content',
    'write_content',
  ]

  const state = getState()

  res.redirect(`https://app.storyblok.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scopes.join(' ')}&state=${state}`)
}

