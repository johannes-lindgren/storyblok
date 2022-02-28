import {Story as StoryData} from "@johannes-lindgren/storyblok-js";
import {StoryContextProvider, useStory} from "@src/context/story-context";
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
            <StoryContextProvider story={story}>
                <ContextualStory Story={Story as StoryComponent} {...props}/>
            </StoryContextProvider>
        )
    }
)

const ContextualStory = ({Story, ...props}: {
    Story: StoryComponent
}): JSX.Element => {
    const story = useStory() // TODO cheating ;)
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
        <Story story={story} {...props}/>
    )
}

export {makeStoryComponent, StoryComponent, StoryComponentProps}