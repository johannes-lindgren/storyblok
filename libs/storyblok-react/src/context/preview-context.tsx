import {createContext, FunctionComponent, useContext} from "react";
import {GetStoryOptions} from "../../../storyblok-js";

type PreviewProviderProps = {
    previewToken: string | undefined | null
    enabled: boolean | undefined | null

    resolveRelations: GetStoryOptions['resolve_relations']
    resolveLinks: GetStoryOptions['resolve_links']
//    TODO resolveRelations resolveLinks
}
const PreviewContext = createContext<PreviewProviderProps>({
    previewToken: undefined,
    enabled: false,
    resolveLinks: undefined,
    resolveRelations: undefined,
})

const usePreview = ():boolean => {
    const {enabled, previewToken} = useContext(PreviewContext)
    return !!enabled && !!previewToken
}

const usePreviewToken = (): string | undefined => {
    const previewContext = useContext(PreviewContext)
    return previewContext.previewToken ?? undefined
}

const useResolveRelations = () => (
    useContext(PreviewContext).resolveRelations
)
const useResolveLinks = () => (
    useContext(PreviewContext).resolveLinks
)

const PreviewProvider: FunctionComponent<PreviewProviderProps> = ({children, ...props}) => {
    return (
        <PreviewContext.Provider value={props}>
            {children}
        </PreviewContext.Provider>
    )
}

export {PreviewProvider, usePreview, usePreviewToken, useResolveLinks, useResolveRelations}