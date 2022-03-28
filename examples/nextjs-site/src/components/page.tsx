import Typography from "@mui/material/Typography";
import * as React from "react";
import {makeStoryComponent} from "@johannes-lindgren/storyblok-react";
import {Block} from "@johannes-lindgren/storyblok-js";
import {DynamicBlock} from "@src/components/dynamic-components";

export type PageData = {
    blocks: Block[]
}

export const Page = makeStoryComponent<PageData>(({story}) => (
        <Typography variant="body2" component='div' color="text.secondary" align="center">
            {story.content.blocks?.map(child => (
                <DynamicBlock block={child} key={child._uid} />
            ))}
        </Typography>
    ), 'page'
)