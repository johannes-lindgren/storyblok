import Container from "@mui/material/Container";
import {
    RichTextData
} from "@johannes-lindgren/storyblok-js";
import {makeBlockComponent, makeStoryComponent} from "@johannes-lindgren/storyblok-react";
import * as React from "react";
import {RichText} from "@src/components/dynamic-components";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export type ArticleData = {
    body: RichTextData
}

export const Article = makeStoryComponent<ArticleData>(({story}) => (
        <ArticleBlock name={story.name} block={story.content}/>
    ),
    'article'
)

const ArticleBlock = makeBlockComponent<ArticleData, { name: string }>(({block, name}) => (
    <Container maxWidth='sm'>
        <Paper elevation={0} sx={{px: 6, py: 6, my: 6}}>
            <Typography variant='h1'>{name}</Typography>
            <RichText richText={block.body}/>
        </Paper>
    </Container>
))