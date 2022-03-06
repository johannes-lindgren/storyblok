import {ApiRequestHandler} from "@api/api-types";
import {makePublishedPreviewHandler} from "@storyblok-nextjs/preview";

const handle:ApiRequestHandler = makePublishedPreviewHandler('path')

export default handle