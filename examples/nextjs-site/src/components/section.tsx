import { makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import Typography from "@mui/material/Typography";
import {RichTextData} from "@johannes-lindgren/storyblok-js";
import {RichText} from "@src/components/dynamic-components";

export type SectionData = {
    title: string
    text: RichTextData
}

export const Section = makeBlockComponent<SectionData>(
    ({block}) => {
        return (
            <>
                <Typography variant='h2'>{block.title}</Typography>
                <RichText richText={block.text}/>
            </>
        )
    }, 'section'
)