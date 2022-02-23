import {Story} from "storyblok-js-client";

export type StoryOption = string | Story
export type StoryOptions = StoryOption[]

export type SelfOption<Values extends string = string> = "" | Values
export type SelfOptions<Values extends string = string> = SelfOption<Values>[]

export type LanguageOption = "" | "default" | string;
export type LanguageOptions = LanguageOption[];

export type DatasourceOption = "" | string;
export type DatasourceOptions = DatasourceOptions[];
