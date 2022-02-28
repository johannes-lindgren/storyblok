import {StoryblokOptionsStatic, PreviewOptions} from "@src/helpers/storyblok-options";
import {Story as StoryData} from "@johannes-lindgren/storyblok-js";
import {StoryblokContextProvider, usePreview, useStory} from "@src/story/storyblok-context";
import {
    BlockComponent,
} from "@src/block/block-component";
import {Alert} from "@src/helpers/alert";

// TODO deprecate this

type StoryComponentProps<C extends Record<string, unknown> = Record<string, unknown>> = {
    story: StoryData<C>
} & PreviewOptions
type StoryComponent<C extends Record<string, unknown> = Record<string, unknown>> = (props: StoryComponentProps<C>) => JSX.Element


type StoryComponentFactory = <C extends Record<string, unknown> = Record<string, unknown>, >(Component: StoryComponent<C>) => StoryComponent<C>

const makeStoryComponentExperimental: StoryComponentFactory = (Story) => (
    ({story, previewToken, ...props}) => {
        return (
            <StoryblokContextProvider story={story} previewToken={previewToken}>
                <ContextualStoryExperimental Story={Story} {...props}/>
            </StoryblokContextProvider>
        )
    }
)

const ContextualStoryExperimental = <C extends Record<string, unknown>, >({Story, ...props}: {
    Story: StoryComponent<C>
}): JSX.Element => {
    const story = useStory() as unknown as (StoryData<C> | undefined)// TODO cheating ;)
    const preview = usePreview()
    if (!story) {
        // TODO supply placeholder as an attribute of Story
        // Should not happen, since this component is not exported and is only used by the factory method above
        return (
            <Alert level={preview ? 'error' : 'warning'}>
                Unable to render story: no story exists within the context.
            </Alert>
        )
    }
    return (
        <Story story={story} {...props}/>
    )
}

const makeStoryComponent = (Block: BlockComponent, options?: StoryblokOptionsStatic): StoryComponent => (
    (props) => (
        <StoryblokContextProvider {...props} {...options}>
            <ContextualStory Block={Block}/>
        </StoryblokContextProvider>
    )
)

// Wrapper, so that we can use the story context.
// Otherwise, the component will not receive new props when the user edit the content.
const ContextualStory = ({Block}: {
    Block: BlockComponent
}): JSX.Element => {
    // call useStory(), rather than passing the story as props.
    // In edit mode, useStory() will return the correct version
    const story = useStory()
    const preview = usePreview()
    if (!story) {
        // Should not happen, since this component is not exported and is only used by the factory method above
        return (
            <Alert level={preview ? 'error' : 'warning'}>
                Unable to render story: no story exists within the context.
            </Alert>
        )
    }
    return (
        <Block block={story?.content}/>
    )
}

export {makeStoryComponent, makeStoryComponentExperimental, StoryComponent, StoryComponentProps}