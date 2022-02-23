// You either supply both properties, or neither
import {GetStoryOptions} from "@johannes-lindgren/storyblok-js";

type PreviewOptions = {
    previewToken?: string
}

type ResolveOptions = Pick<GetStoryOptions, 'resolve_links' | 'resolve_relations'>

type PublicTokenOption = {
    publicToken?: string
}

type StoryblokOptionsStatic = ResolveOptions & PublicTokenOption // Set by the developers at build time
type StoryblokOptions = StoryblokOptionsStatic & PreviewOptions

export {PreviewOptions, StoryblokOptionsStatic, StoryblokOptions}
