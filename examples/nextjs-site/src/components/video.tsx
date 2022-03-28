import * as React from "react";
import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import ReactPlayer from 'react-player'
import {PlayCircle} from "@mui/icons-material";
import {Alert} from "@mui/material";
import Typography from "@mui/material/Typography";
import {RichText} from "@src/components/dynamic-components";
import {RichTextData} from "@johannes-lindgren/storyblok-js";
import Stack from "@mui/material/Stack";
import {styled} from "@mui/material/styles";

export type VideoData = {
    url: string
    caption: RichTextData
}

const AspectRatioBox = styled('div')(({theme}) => ({
    position: 'relative',
    paddingTop: '56.25%',
    '& > *': {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
    },
    '& .react-player__preview': {
      borderRadius: theme.shape.borderRadius,
    },
}))

export const Video = makeBlockComponent<VideoData>(({block}) => (
        <Stack>
            <AspectRatioBox>
                <ReactPlayer
                    width='100%'
                    height='100%'
                    light={true}
                    playIcon={<PlayCircle sx={{fontSize: '100px'}} color="action"/>}
                    fallback={<Alert>The video cannot be played. There might be something wrong with the URL.</Alert>}
                    url={block.url}
                />
            </AspectRatioBox>
            <Typography variant='caption' sx={{mx: 2, my: 1}}>
                <RichText richText={block.caption}/>
            </Typography>
        </Stack>
    ), 'video'
)