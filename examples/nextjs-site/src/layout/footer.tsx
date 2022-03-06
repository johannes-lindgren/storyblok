import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Link from "@src/link";

export const Footer = () => (
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
)