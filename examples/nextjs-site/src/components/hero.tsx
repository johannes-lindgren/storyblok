import Typography from "@mui/material/Typography";
import * as React from "react";
import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import {ThemeProvider} from "@mui/material";
import theme, {darkTheme} from "@src/theme";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import {Block, RichTextData, SelfOptionData} from "@johannes-lindgren/storyblok-js";
import {RichText, DynamicBlock} from "@src/components/dynamic-components"
import Stack from "@mui/material/Stack";

export type HeroData = {
    title: string
    text: RichTextData
    darkMode: boolean
    elevation: boolean
    alignment: SelfOptionData<'flex-start' | 'center' | 'flex-end'>
    children: Block[]
}

export const Hero = makeBlockComponent<HeroData>(({block}) => (
        <ThemeProvider theme={block.darkMode ? darkTheme : theme}>
            <Paper elevation={block.elevation ? 12 : 0} sx={{borderRadius: 0, py: 4}}>
                <Container maxWidth="md">
                    <Stack>
                        <Typography
                            variant="h3"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: block.alignment || 'center'
                            }}
                        >
                            {block.title}
                        </Typography>
                        <Typography variant='subtitle1' component='div'>
                            <RichText richText={block.text}/>
                        </Typography>
                        {block.children?.map(child => <DynamicBlock block={child} key={child._uid}/>)}
                    </Stack>
                </Container>
            </Paper>
        </ThemeProvider>
    ), 'hero'
)
