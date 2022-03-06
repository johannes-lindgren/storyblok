import {ApiRequestHandler} from "@api/api-types";
import {makeDraftPreviewHandler} from "@storyblok-nextjs/preview";

const handle:ApiRequestHandler = makeDraftPreviewHandler( 'path', process.env.STORYBLOK_PREVIEW_TOKEN)

export default handle