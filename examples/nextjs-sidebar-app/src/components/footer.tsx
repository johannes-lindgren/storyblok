import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@src/link";
import * as React from "react";
import { makeBlockComponent} from "@johannes-lindgren/storyblok-react";

export type FooterData = {}

export const Footer = makeBlockComponent<FooterData>(({}) => (
        <Typography variant="body2" component='div' color="text.secondary" align="center">
            <Grid container spacing={4} alignItems='center' paddingY={4}>
                <Grid item xs={12} sm={6}>
                    By Johannes Lindgren
                </Grid>
                <Grid item xs={12} sm={6}>
                    Copyright ©
                    <Link color="inherit" href="/">
                        My Blog
                    </Link>{' '}
                    {new Date().getFullYear()}.
                </Grid>
            </Grid>
        </Typography>
    ), 'footer'
)