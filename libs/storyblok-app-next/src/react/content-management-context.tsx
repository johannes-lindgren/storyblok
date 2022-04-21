import {useSession, useUserInfo} from "./custom-app-context";
import {createContext, FunctionComponent, PropsWithChildren, useContext, useMemo} from "react";
import {ContentManagementClient} from "@johannes-lindgren/storyblok-js";
import {Session} from "next-auth";

const ContentManagementContext = createContext<ContentManagementClient | undefined>(undefined);

const ContentManagementClientProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const {space} = useUserInfo()
    const {session, subscribeRefresh} = useSession()

    const client = useMemo(() => {
        // TODO unsubscribe the old client when
        const client = new ContentManagementClient(session.accessToken, space.id)
        subscribeRefresh((session: Session) => {
                console.log('Setting access token')
                client.setAccessToken(session.accessToken)
            }
        )
        return client
    }, [space.id])


    return (
        <ContentManagementContext.Provider value={client}>
            {children}
        </ContentManagementContext.Provider>
    )
}

const useContentManagementClient = (): ContentManagementClient => {
    const client = useContext(ContentManagementContext)
    if(!client){
        throw new Error(`\`useContentManagementClient()\` must be wrapped in a <${ContentManagementClientProvider.displayName} />`)
    }
    return client
}

export {ContentManagementClientProvider, useContentManagementClient}