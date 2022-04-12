import {FooterData} from "@src/components/footer";
import {HeaderData} from "@src/components/header";
import {styled} from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import {ReactNode} from "react";
import {DynamicBlock} from "@src/components/dynamic-components";
import {
    makeBlockComponent,
    makeStoryComponent,
} from "@johannes-lindgren/storyblok-react";

export type LayoutData = {
    header: HeaderData[]
    footer: FooterData[]
}

const LayoutStory = makeStoryComponent<LayoutData, { children?: ReactNode }>(({story, children}) => (
    <Layout block={story.content}>
        {children}
    </Layout>
))

const Main = styled("main")(({}) => ({
    minHeight: `100vh`,
}));

const Layout = makeBlockComponent<LayoutData, { children?: ReactNode }>(({block, children}) => (
        <>
            <DynamicBlock block={block?.header?.[0]}/>
            <Toolbar/>
            <Main>
                {children}
            </Main>
            <DynamicBlock block={block?.footer?.[0]}/>
        </>
    ), 'layout'
)

export {Layout, LayoutStory}
