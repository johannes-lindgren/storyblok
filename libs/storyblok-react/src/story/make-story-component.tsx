// import {BlockComponent} from "@src/block";
import {Story as StoryData} from "@johannes-lindgren/storyblok-js";
import {WithComponentName} from "@src/with-component-name"
import {StoryContextProvider, usePreview, useStory} from "@src/context";
import {Alert} from "@src/helpers/alert";

type R = Record<string, unknown>
type StoryComponentProps<C extends Record<string, unknown> = Record<string, unknown>> = {
    story: StoryData<C>
}
type StoryComponent<BlockData extends R = R, OtherProps extends R = R> = (props: OtherProps & StoryComponentProps<BlockData>) => JSX.Element

function makeStoryComponent<BlockData extends R = {}, OtherProps extends R = {}, >(Component: StoryComponent<BlockData, OtherProps>, componentName: string): WithComponentName<StoryComponent<BlockData, OtherProps>>;
function makeStoryComponent<BlockData extends R = {}, OtherProps extends R = {}, >(Component: StoryComponent<BlockData, OtherProps>): StoryComponent<BlockData, OtherProps>;

/**
 * Creates a React component that can render blocks. Preview will be enabled if wrapped within an enabled PreviewProvider.
 * @param StoryComponent A React component that accepts a "block" attribute.
 * @param componentName Optional: if included, the component can be registered within the dynamic block components. The value should be the Storyblok component name that this React component correspond to. I.e. the value of the 'component' property on the blocks.
 *
 */
function makeStoryComponent<BlockData extends R = {}, OtherProps extends R = {}, >(StoryComponent: StoryComponent<BlockData, OtherProps>, componentName?: string) {
    const StoryWithWrapper = ({story, ...props}: Parameters<typeof StoryComponent>[0]) => (
        <StoryContextProvider story={story}>
            <ContextualStory Story={StoryComponent as StoryComponent} props={props}/>
        </StoryContextProvider>
    )
    if (!componentName) {
        return StoryWithWrapper
    }
    return (
        Object.assign(
            StoryWithWrapper, {
                // Add displayName and componentName as properties to the function.
                displayName: componentName,
                componentName: componentName,
            })
    )
}


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


export {makeStoryComponent, StoryComponentProps, StoryComponent}