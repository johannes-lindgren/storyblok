import {StoryData} from "storyblok-js-client";
import {Block} from "../block";

export type Story<B extends Block = Block> = StoryData<B>
