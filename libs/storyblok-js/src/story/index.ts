import {StoryData} from "storyblok-js-client";
import {Block} from "../block";

export type Story<C extends Record<string, unknown> = Record<string, unknown>> = StoryData<Block<C>>

export const isDraft = (story: Story) => typeof story.content?._editable !== 'undefined'
export const isPublished = (story: Story) => !isDraft(story)