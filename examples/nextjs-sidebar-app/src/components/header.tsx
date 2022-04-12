import {Icon, ThemeProvider} from "@mui/material";
import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import {Block, ImageAssetData} from "@johannes-lindgren/storyblok-js";
import AppBar from "@mui/material/AppBar";
import {darkTheme} from "@src/theme";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {LanguageSelect} from "@src/language-select";
import * as React from "react";
import {DynamicBlock} from "@src/components/dynamic-components"

export type HeaderData = {
    title: string
    navItems: Block[]
    logo: ImageAssetData
}

export const Header = makeBlockComponent<HeaderData>(({block}) => (
        <AppBar elevation={0}>
            <ThemeProvider theme={darkTheme}>
                <Container maxWidth="xl">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{flexGrow: 1, display: 'flex', alignItems: 'center'}}
                        >
                            <Icon fontSize='large' sx={{mx: 1 }}>
                                <img src={block.logo?.filename ?? undefined} alt={block.logo?.alt ?? undefined}
                                     title={block.logo?.title ?? undefined}/>
                            </Icon>
                            {block.title}
                        </Typography>
                        {block.navItems?.map(it => <DynamicBlock block={it} key={it._uid}/>)}
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}/>
                        <LanguageSelect/>
                    </Toolbar>
                </Container>
            </ThemeProvider>
        </AppBar>

    ),
    'header'
)