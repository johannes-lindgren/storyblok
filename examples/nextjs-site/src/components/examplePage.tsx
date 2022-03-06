import {DynamicBlock} from "@src/components/dynamic-components";
import Container from "@mui/material/Container";
import {
    DatasourceOption,
    LanguageOption,
    LinkData,
    SelfOption,
    StoryOption,
    StoryOptions,
    Block as BlockData
} from "@johannes-lindgren/storyblok-js";
import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import * as React from "react";

export type PageData = {
    blocks: BlockData[]
    linkedObject: LinkData
    storiesSingleOption: StoryOption
    storiesMultiOptions: StoryOptions
    selfSingleOption: SelfOption
    languageSingleOption: LanguageOption
    datasourceSingleOption: DatasourceOption
}

export const ExamplePage = makeBlockComponent<PageData>( ({block}) => (
        <Container maxWidth='sm'>
            {block.blocks?.map(block => (
                <DynamicBlock block={block} key={block._uid}/>
            ))}
        </Container>
    ), 'examplePage'
)