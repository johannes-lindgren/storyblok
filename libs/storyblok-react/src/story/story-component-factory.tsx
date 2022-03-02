import {Story as StoryData} from "@johannes-lindgren/storyblok-js";
import {StoryContextProvider, useStory} from "@src/context/story-context";
import {Alert} from "@src/helpers/alert";
import {usePreview} from "@src/context";

type StoryComponentProps<C extends Record<string, unknown> = Record<string, unknown>> = {
    story: StoryData<C>
}

type R = Record<string, unknown>
type StoryComponent<BlockData extends R = R, OtherProps extends R = R> = (props: OtherProps & StoryComponentProps<BlockData>) => JSX.Element

type StoryComponentFactory = <BlockData extends R = R, OtherProps extends R =R, >(Component:  StoryComponent<BlockData, OtherProps>) => StoryComponent<BlockData, OtherProps>

const makeStoryComponent: StoryComponentFactory = (Story) => (
    ({story, ...props}) => {
        return (
            <StoryContextProvider story={story}>
                <ContextualStory Story={Story as StoryComponent} props={props}/>
            </StoryContextProvider>
        )
    }
)


const ContextualStory = ({Story, props}: {
    Story: StoryComponent
    props: any
}): JSX.Element => {
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
        <Story story={story} {...props}/>
    )
}

export {makeStoryComponent, StoryComponent, StoryComponentProps}