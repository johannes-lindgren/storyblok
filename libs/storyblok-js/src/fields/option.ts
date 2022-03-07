import {Story} from "../story";

type R = Record<string, unknown>

export type StoryOptionData<BlockData extends R = R> = string | Story<BlockData>

export type SelfOptionData<ValueOption extends string = string> = "" | ValueOption

export type LanguageOptionData = "" | "default" | string;

export type DatasourceOptionData = "" | string;
