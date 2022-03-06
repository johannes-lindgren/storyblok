import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as React from "react";
import Logo from '@mui/icons-material/Code';
import {LanguageSelect} from "@src/language-select";
import {Button, ThemeProvider} from "@mui/material";
import {darkTheme} from "@src/theme";

export const SiteAppBar = () => (
    <AppBar>
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth="xl">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1, display: 'flex', alignItems: 'center'}}
                    >
                        <Logo fontSize='large' sx={{mx: 1, color: 'secondary.main'}}/>Johannes Lindgren
                    </Typography>
                    <Button href='resume-1'>Resume 1</Button>
                    <Button href='resume-2'>Resume 2</Button>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}/>
                    <LanguageSelect/>
                </Toolbar>
            </Container>
        </ThemeProvider>
    </AppBar>
)