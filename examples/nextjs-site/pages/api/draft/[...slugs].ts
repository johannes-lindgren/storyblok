import {makeDraftPreviewHandler} from "@storyblok-nextjs/preview";

const handle = makeDraftPreviewHandler( 'slugs', process.env.STORYBLOK_PREVIEW_TOKEN)

export default handle