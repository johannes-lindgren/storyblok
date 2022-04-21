import {FunctionComponent, SuspenseProps} from "react";
import {ContentManagementClientProvider} from "@src/react/content-management-provider";
import {RefreshingSessionProvider} from "@src/react/refreshing-session-provider";

// TODO this would not be a good idea for tools. It works the same as sidebar apps, but it doesn't make sense without the content context.
//  add property where this feature can be enabled/disabled
// const isAppEmbedded = () => window.top != window.self
// useEffect(() => {
//     if (!isAppEmbedded()) {
//         console.log('The app should be embedded within the Storyblok app, redirecting...')
//         window.location.assign('https://app.storyblok.com/oauth/app_redirect')
//     }
// }, [])

const CustomAppProvider: FunctionComponent<SuspenseProps> = ({children, fallback}) => (
    <RefreshingSessionProvider fallback={fallback}>
        <ContentManagementClientProvider>
            {children}
        </ContentManagementClientProvider>
    </RefreshingSessionProvider>
)
export {CustomAppProvider};