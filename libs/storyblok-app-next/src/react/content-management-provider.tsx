import {useSession, useUserInfo} from "./refreshing-session-provider";
import {createContext, FunctionComponent, PropsWithChildren, useContext, useMemo, useRef} from "react";
import {ContentManagementClient} from "@johannes-lindgren/storyblok-js";
import {Session} from "next-auth";
import {Subscriber} from "@src/react/subject";

const ContentManagementContext = createContext<ContentManagementClient | undefined>(undefined);

const ContentManagementClientProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const {space} = useUserInfo()
    const currentSubscriber = useRef<Subscriber<Session> | undefined>(undefined)
    const {session, subscribeRefresh, unsubscribeRefresh} = useSession()
    const client = useMemo(() => {
        if(currentSubscriber.current){
            unsubscribeRefresh(currentSubscriber.current)
        }

        const client = new ContentManagementClient(session.accessToken, space.id)

        currentSubscriber.current = subscribeRefresh(
            (session: Session) =>  client.setAccessToken(session.accessToken)
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