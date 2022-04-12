import axios, { AxiosRequestConfig } from "axios";
import { GrantProvider } from "grant";
import StoryblokClient from "storyblok-js-client";
import { grantConfig } from "@src/grant-config";
import qs from "qs";
import { FirebaseSession } from "../../../types/session.types";

export interface Session extends TokenResponse {
  space_id: string | string[];
  code: string | string[];
  req: NextApiRequest;
}

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type TokenRequest = {
  grant_type: string;
  provider: string;
  code?: string;
  refresh_token?: string;
  config?: GrantProvider;
};

export const StoryblokManagementClient = (oauthToken: string) =>
  new StoryblokClient({
    oauthToken: `Bearer ${oauthToken}`,
  });

export const getToken = (req: TokenRequest): Promise<TokenResponse> => {
  const providerConfig: GrantProvider = grantConfig.config[req.provider];

  return new Promise((resolve, reject) => {
    const requestConfig: AxiosRequestConfig = createTokenRequest({
      ...req,
      config: providerConfig,
    });

    axios(requestConfig)
      .then((response) => {
        const { access_token, refresh_token, expires_in } = response.data;
        resolve({
          access_token,
          refresh_token: refresh_token || req.refresh_token,
          expires_in,
        });
      })
      .catch(() => reject);
  });
};

export const isValidSession = (session: FirebaseSession): boolean => {
  return !!session?.storyblok?.access_token;
};

// NOT EXPORTED FUNCTIONS
const createTokenRequest = (req: TokenRequest): AxiosRequestConfig => {
  const { config, grant_type, code, refresh_token } = req;
  return {
    url: config?.access_url,
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({
      grant_type,
      code,
      refresh_token,
      client_id: config?.key,
      client_secret: config?.secret,
      redirect_uri: config?.redirect_uri,
    }),
  };
};
