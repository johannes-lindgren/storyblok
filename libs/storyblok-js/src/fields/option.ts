import {Story} from "storyblok-js-client";

export type StoryOptionData = string | Story
export type StoryOptionsData = StoryOptionData[]

export type SelfOptionData<ValueOption extends string = string> = "" | ValueOption
export type SelfOptionsData<ValueOption extends string = string> = SelfOptionData<ValueOption>[]

export type LanguageOptionData = "" | "default" | string;
export type LanguageOptionsData = LanguageOptionData[];

export type DatasourceOptionData = "" | string;
export type DatasourceOptionsData = DatasourceOptionsData[];
