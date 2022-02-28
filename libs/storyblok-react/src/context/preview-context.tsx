import {createContext, FunctionComponent, useContext} from "react";

type PreviewProviderProps = {
    previewToken: string | undefined | null
    enabled: boolean | undefined | null
//    TODO resolveRelations resolveLinks
}
const PreviewContext = createContext<PreviewProviderProps>({
    previewToken: undefined,
    enabled: false,
})

const usePreview = ():boolean => {
    const {enabled, previewToken} = useContext(PreviewContext)
    return !!enabled && !!previewToken
}

const usePreviewToken = (): string | undefined => {
    const previewContext = useContext(PreviewContext)
    return previewContext.previewToken ?? undefined
}

const PreviewProvider: FunctionComponent<PreviewProviderProps> = ({children, ...props}) => {
    return (
        <PreviewContext.Provider value={props}>
            {children}
        </PreviewContext.Provider>
    )
}

export {PreviewProvider, usePreview, usePreviewToken}