import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import {Alert} from "@mui/material";

export const Fallback = makeBlockComponent(({block}) => (
    <Alert severity='error'>Unknown component type `{block.component}`</Alert>
))