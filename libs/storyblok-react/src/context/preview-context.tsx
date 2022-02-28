import {FunctionComponent} from "react";

type PreviewProviderProps = {
    previewToken: string
    enabled?: boolean
}

const PreviewProvider: FunctionComponent<PreviewProviderProps> = ({children}) => {
    return (
        <>{children}</>
    )
}

export {PreviewProvider}