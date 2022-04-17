import * as React from "react";
import {styled} from "@mui/material/styles";

const Main = styled("main")(({ }) => ({
    minHeight: `100vh`,
}));

export const Layout: React.FunctionComponent<{children: React.ReactNode}> = ({children}) => (
    <div>
        <Main>
            {children}
        </Main>
    </div>
)