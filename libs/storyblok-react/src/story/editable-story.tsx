import {StoryComponent} from "@src/story/story-component-factory";
import {StoryContextProvider, usePreview, useStory} from "@src/context";
import {Alert} from "@src/helpers/alert";
import {Story} from "@johannes-lindgren/storyblok-js";

// TODO decide whether this experimental feature should be included

const EditableStory = <C extends Record<string, unknown>,>({story, children}:{
    children: (story: Story<C>) => JSX.Element
    story: Story<C>
}) => {
    return (
        <StoryContextProvider story={story}>
            <ContextualStory Story={children as unknown as StoryComponent}/>
        </StoryContextProvider>
    )
}

const ContextualStory = ({Story}: {
    Story: StoryComponent
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
        <Story story={story} {...story}/>
    )
}

export {EditableStory}