import {Story as StoryData} from "@johannes-lindgren/storyblok-js";
import {StoryblokContextProvider, useStory} from "@src/story/storyblok-context";
import {Alert} from "@src/helpers/alert";
import {usePreview} from "@src/context";

// TODO deprecate this

type StoryComponentProps<C extends Record<string, unknown> = Record<string, unknown>> = {
    story: StoryData<C>
}
type StoryComponent<C extends Record<string, unknown> = Record<string, unknown>> = (props: StoryComponentProps<C>) => JSX.Element

type StoryComponentFactory = <C extends Record<string, unknown> = Record<string, unknown>, >(Component: StoryComponent<C>) => StoryComponent<C>

const makeStoryComponent: StoryComponentFactory = (Story) => (
    ({story, ...props}) => {
        return (
            <StoryblokContextProvider story={story}>
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

export {makeStoryComponent, StoryComponent, StoryComponentProps}