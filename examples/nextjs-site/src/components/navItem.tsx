import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import {LinkData} from "@johannes-lindgren/storyblok-js";
import * as React from "react";
import {Button} from "@mui/material";
import {getHref} from "@src/getHref";

export type NavItemData = {
    title: string
    link: LinkData
}

export const NavItem = makeBlockComponent<NavItemData>(({block}) => (
        <Button
            href={block.link && getHref(block.link)}
            disabled={!block.link}
        >
            {block.title}
        </Button>
    ), 'navItem'
)

