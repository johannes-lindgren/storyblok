import {StoryblokOptionsStatic, PreviewOptions} from "@src/helpers/storyblok-options";
import {StoryData} from "storyblok-js-client";
import {StoryblokContextProvider, usePreview, useStory} from "@src/story/storyblok-context";
import {
    BlockComponent,
} from "@src/block/block-component";
import {Alert} from "@src/helpers/alert";

type StoryComponentProps = {
    story: StoryData
} & PreviewOptions

type StoryComponent = (props: StoryComponentProps) => JSX.Element

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
    const topBlock = story?.content
    const preview = usePreview()
    if(!topBlock){
        // Should not happen, since this component is not exported and is only used by the factory method above
        return (
            <Alert level={preview ? 'error' : 'warning'}>
                Unable to render story: no story exists within the context.
            </Alert>
        )
    }
    return (
        <Block block={topBlock}/>
    )
}

export {makeStoryComponent, StoryComponent, StoryComponentProps}