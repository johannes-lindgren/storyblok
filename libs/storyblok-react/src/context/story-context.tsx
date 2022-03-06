import {
    createContext,
    FunctionComponent,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {
    ContentDeliveryClient,
    isDraft, isPublished,
    Story,
    StoryblokBridgeV2
} from "@johannes-lindgren/storyblok-js";
import {StoryData} from "storyblok-js-client";
import {loadBridge} from "@johannes-lindgren/storyblok-js";
import {usePreview} from "@src/context/preview-context";
import {
    usePreviewToken,
    useResolveRelations,
    useResolveLinks,
} from "@src/context/preview-context";

const StoryContext = createContext<Story | undefined>(undefined)

type StoryblokContextProps = {
    story?: StoryData
}

// Returns the story from the context. To set the context, use the <Story> component from makeComponents()
// or directly set the context with the <StoryblokContextProvider>
const useStory = () => (
    useContext(StoryContext)
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

const usePreviewedStory = ({
                          story: initialStory,
                      }: StoryblokContextProps): Story | undefined => {
    const [story, setStory] = useState(initialStory);
    const preview = usePreview()
    const previewToken = usePreviewToken()
    const resolve_links = useResolveLinks()
    const resolve_relations = useResolveRelations()

    if((previewToken !== undefined) && (story !== undefined) && isPublished(story)){
        // TODO we can easily just fetch the draft version if the published was supplied by mistake.
        console.warn('A preview token has been supplied together with a published story. Consider supplying a draft version instead.')
    }
    if(previewToken === undefined && (story !== undefined) && isDraft(story)){
        console.warn('A draft has been supplied without a preview token. If you intend to enable preview, provide a preview token.')
    }

    // Note: This makes it impossible to change the language. But this is ok since storyblok will reload the app when
    // you change the language in editor mode.
    // TODO Actually... might not be ok, because you might want to change the language in edit mode.
    //  Although this should rather be done in the Storyblok editor, and not in-app
    const {current: language} = useRef(initialStory?.lang)

    const storyblokClient = useStoryblokClient(previewToken ?? undefined)

    // TODO load bridge once and manage a list of subscribers
    const initEventListeners = (storyblokBridge: StoryblokBridgeV2) => {
        console.log('initEventListeners()')
        // reload on Next.js page on save or publish event in the Visual Editor
        storyblokBridge.on(['change', 'published'], () => {
            location.reload()
        })

        // live update the story on input events
        storyblokBridge.on('input', (event: StoryblokEventPayload) => {
            // check if the ids of the event and the passed story match
            if (story && event.story.content._uid === story.content._uid) {
                // change the story content through the setStory function
                console.log(`input from story ${event.story?.name}`)
                setStory(event.story);
            }
        });

        // TODO this loads the draft, but not unsaved changes. These will only be visible on first input event
        // TODO why is this callback invoked twice for each bridge? (the bridge is subscribed to the correct # times)
        storyblokBridge.on('enterEditmode', (event: StoryblokEventPayload) => {
            console.log(`enter editmode for story id=${event.storyId}`)
            if (!event.storyId) {
                console.error(`Intercepted 'enterEditmode' event that doesn't contain a story`)
                return
            }
            if (!storyblokClient) {
                throw new Error('Preview mode was entered without initializing a preview http client first. Most likely, a preview token was not supplied')
            }
            if(!initialStory){
                return;
            }
            if(event.storyId !== initialStory.id.toString()){
                // The end-user entered edit mode for a different story
                return;
            }
            // loading the latest draft version on initial enter of editor
            storyblokClient.getStory(event.storyId, {
                version: 'draft',
                resolve_relations,
                resolve_links,
                language,
            }).then((story) => {
                setStory(story);
            }).catch((error) => {
                // TODO handle differently...
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
            // Note: we are creating one bridge for each previewed story
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

    return story
}

// Enables children to use useStory and usePreview
const StoryContextProvider: FunctionComponent<StoryblokContextProps> = ({
                                                                                children,
                                                                                ...props
                                                                            }) => {
    const storyblokContext = usePreviewedStory(props)
    return (
        <StoryContext.Provider
            value={storyblokContext}
        >
            {children}
        </StoryContext.Provider>
    )
}

export {useStory, StoryContextProvider}