import { NextApiRequest, NextApiResponse } from "next";
import { StoryblokManagementClient } from "./utils/storyblok";
import SessionService from "../../services/session.service";
import StoryblokRepository from "../../repositories/callback.repository";
type StoryblokHandler<Type> = (
  client: StoryblokRepository,
  spaceId: string,
  req: NextApiRequest
) => Promise<Type>;

type Route = <T>(
  handler: StoryblokHandler<T>
) => (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

//Question: Are returns necessary in this scenario?
export const StoryblokRoute: Route = <Type>(
  handler: StoryblokHandler<Type>
) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const sessionService = new SessionService(req);
    const session = await sessionService.getSession();

    if (typeof session === "object" && !!session.storyblok?.access_token) {
      const client = StoryblokManagementClient(session.storyblok.access_token);
      try {
        const storyblokRepository = new StoryblokRepository(client);
        const data = await handler(
          storyblokRepository,
          session.storyblok.space_id,
          req
        );

        res.status(200).json(data);
      } catch (e) {
        //TODO: refresh token
        res
          .status(500)
          .json({ error: "Request towards the Management API failed!" });
      }
    } else {
      res.status(500).json({ error: "Invalid session!" });
    }
  };
};
