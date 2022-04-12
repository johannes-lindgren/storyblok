import SHA256 from "crypto-js/sha256";
import { v4 as uuid } from "uuid";
import { GrantProvider, GrantSessionConfig } from "grant";

const codeIdentifier = uuid();

type GrantConfig = {
  defaults: GrantProvider;
  [provider: string]: GrantProvider;
}

type GrantOptions = {
  /**
   * Handler name
   */
  handler?:
    | "express"
    | "koa"
    | "hapi"
    | "fastify"
    | "curveball"
    | "node"
    | "aws"
    | "azure"
    | "gcloud"
    | "vercel";

  config: GrantConfig;

  session?: GrantSessionConfig;
}


export const grantConfig: GrantOptions = {
  config: {
    defaults: {
      origin: "http://localhost:3000",
      transport: "session",
      //prefix: "/api/connect",
    },
    storyblok: {
      key: process.env.STORYBLOK_CLIENT_ID,
      secret: process.env.STORYBLOK_CLIENT_SECRET,
      redirect_uri: process.env.STORYBLOK_CLIENT_REDIRECT_URI,
      authorize_url: "https://app.storyblok.com/oauth/authorize",
      access_url: "https://app.storyblok.com/oauth/token",
      callback: "/api/callback",
      oauth: 2,
      response: ["tokens"],
      scope: "read_content write_content",
      custom_params: {
        response_type: "code",
        code_challenge: SHA256(codeIdentifier).toString(),
        code_challenge_method: "S256",
        state: codeIdentifier,
      },
    },
  },
  session: {
    secret: "grant",
    cookie: {
      sameSite: "none",
      path: "/",
      httpOnly: true,
      secure: true,
    },
  },
};
