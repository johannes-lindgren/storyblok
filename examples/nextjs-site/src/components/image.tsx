import * as React from "react";
import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {RichText} from "@src/components/dynamic-components";
import {getImageSrc, ImageAssetData, RichTextData} from "@johannes-lindgren/storyblok-js";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export type ImageData = {
    image: ImageAssetData
    caption: RichTextData
}

export const Image = makeBlockComponent<ImageData>(({block}) => (
        <Stack>
            <Box
                component='img'
                sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                }}
                src={block.image && getImageSrc(block.image, {width: 1000, height: 500, focal: 'imageAsset'})}
                title={block.image?.title ?? undefined}
                alt={block.image?.alt ?? undefined}
            />
            <Typography variant='caption' sx={{mx: 2, my: 1}}>
                <RichText richText={block.caption} />
            </Typography>
        </Stack>
    ), 'image'
)