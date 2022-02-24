import {
    createContext,
    FunctionComponent,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {ContentDeliveryClient, GetStoryOptions, Story, StoryblokBridgeV2} from "@johannes-lindgren/storyblok-js";
import {StoryData} from "storyblok-js-client";
import {loadBridge} from "../../../storyblok-js/src";

type StoryblokContextData = {
    story: Story | undefined
    preview: boolean
}

const StoryblokContext = createContext<StoryblokContextData>({
    story: undefined,
    preview: false,
})

type StoryblokContextProps = {
    story?: StoryData
    previewToken?: string | null
    publicToken?: string | null
} & Pick<GetStoryOptions, 'resolve_links' | 'resolve_relations'>

const useStoryblokContext = () => (
    useContext(StoryblokContext)
)

// Returns the story from the context. To set the context, use the <Story> component from makeComponents()
// or directly set the context with the <StoryblokContextProvider>
const useStory = () => (
    useStoryblokContext().story
)

// Returns the story from the context. To set the context, use the <Story> component from makeComponents()
// or directly set the context with the <StoryblokContextProvider>.
const usePreview = () => (
    useStoryblokContext().preview
)

/**
 * Client-side Storyblok content delivery client
 * @param accessToken
 */
const useStoryblokClient = (accessToken: string | undefined): ContentDeliveryClient | undefined => (
    useMemo(() => typeof accessToken === 'undefined' ? undefined : (
        new ContentDeliveryClient(accessToken)
    ), [accessToken])
)

const useStoryblok = ({
                          story: initialStory,
                          previewToken,
                          resolve_relations,
                          resolve_links,
                          publicToken
                      }: StoryblokContextProps): StoryblokContextData => {
    const [story, setStory] = useState(initialStory);
    const preview = !!previewToken

    // Note: This makes it impossible to change the language. But this is ok since storyblok will reload the app when
    // you change the language in editor mode.
    // TODO Actually... might not be ok, because you might want to change the language in edit mode.
    //  Although this should rather be done in the Storyblok editor, and not in-app
    const {current: language} = useRef(initialStory?.lang)

    const storyblokClient = useStoryblokClient(previewToken ?? publicToken ?? undefined)

    const initEventListeners = (storyblokBridge: StoryblokBridgeV2) => {
        // reload on Next.js page on save or publish event in the Visual Editor
        storyblokBridge.on(['change', 'published'], () => {
            location.reload()
        })

        // live update the story on input events
        storyblokBridge.on('input', (event: StoryblokEventPayload) => {
            console.log('on input')
            // check if the ids of the event and the passed story match
            if (story && event.story.content._uid === story.content._uid) {
                // change the story content through the setStory function
                setStory(event.story);
            }
        });

        storyblokBridge.on('enterEditmode', (event: StoryblokEventPayload) => {
            if (!event.storyId) {
                console.error(`Intercepted 'enterEditmode' event that doesn't contain a story`)
                return
            }
            if (!storyblokClient) {
                throw new Error('Preview mode was entered without initializing a preview http client first. Most likely, a preview token was not supplied')
            }
            // TODO this loads the draft, but not unsaved changes. These will only be visible on first input event
            // loading the draft version on initial enter of editor
            storyblokClient.getStory(event.storyId, {
                version: 'draft',
                resolve_relations,
                resolve_links,
                language,
            }).then((story) => {
                if (story) {
                    setStory(story);
                }
            }).catch((error) => {
                console.log(error);
            });
        })
    }

    // adds the events for updating the visual editor
    // see https://www.storyblok.com/docs/guide/essentials/visual-editor#initializing-the-storyblok-js-bridge
    useEffect(() => {
        if (!preview) {
            return
        }
        loadBridge().then(StoryblokBridge => {
            // initialize the bridge with your token
            const storyblokBridge = new StoryblokBridge({
                resolveRelations: resolve_relations
            });
            initEventListeners(storyblokBridge)
        })
    }, [])
    // Update the story when the initialStory changes
    useEffect(() => {
        setStory(initialStory);
    }, [initialStory?.uuid]);

    return {
        story: story,
        preview,
    };
}

// Enables children to use useStory and usePreview
const StoryblokContextProvider: FunctionComponent<StoryblokContextProps> = ({
                                                                                children,
                                                                                ...props
                                                                            }) => {
    const storyblokContext = useStoryblok(props)
    return (
        <StoryblokContext.Provider
            value={storyblokContext}
        >
            {children}
        </StoryblokContext.Provider>
    )
}

export {useStory, usePreview, StoryblokContextProvider}