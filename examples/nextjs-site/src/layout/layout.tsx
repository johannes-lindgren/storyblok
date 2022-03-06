import * as React from "react";
import {SiteAppBar} from "./site-app-bar";
import {Footer} from "./footer";
import {styled} from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";

const Main = styled("main")(({ }) => ({
    minHeight: `100vh`,
}));

export const Layout: React.FunctionComponent = ({children}) => (
    <div>
        {/*<SiteAppBar />*/}
        {/*<Toolbar />*/}
        <Main>
            {children}
        </Main>
        {/*<Footer />*/}
    </div>
)