import {BlockComponent} from "@src/block";
import {WithComponentName} from "@src/with-component-name";
import {makeStoryComponent, StoryComponent} from "@src/story/make-story-component";
import {DefaultStoryFallback} from "@src/story/default-story-fallback";

// type StoryComponentMapping = Record<string, BlockComponent | undefined>

type StoryComponentFactoryOptions = {
    blockComponents?: WithComponentName<BlockComponent>[]
    storyComponents?: WithComponentName<StoryComponent>[]
    StoryFallback?: StoryComponent
}

type StoryComponentFactory = (options: StoryComponentFactoryOptions) => StoryComponent

const makeComponentMapping = <T,>(components: WithComponentName<T>[]): Record<string, T | undefined> => (
    components?.reduce((mapping, Component) => {
        return Object.assign(
            mapping,
            {
                [Component.componentName]: Component
            }
        )
    }, {})
)


/**
 * @returns A React component for rendering Storyblok blocks dynamically
 */
const makeDynamicStoryComponent: StoryComponentFactory = ({
                                                              storyComponents = [],
                                                              blockComponents = [],
                                                              StoryFallback = DefaultStoryFallback,
                                                          }) => (
    function DynamicStoryComponent({story}) {
        const storyMapping = makeComponentMapping(storyComponents)
        const blockMapping = makeComponentMapping(blockComponents)
        const {component} = story.content
        const StoryComponent = storyMapping[component]

        if(StoryComponent){
            return <StoryComponent story={story} />
        }
        const BlockComponent = blockMapping[component]
        if(BlockComponent){
            const S = makeStoryComponent(({story}) => <BlockComponent block={story.content}/>)
            return <S story={story} />
        }
        return <StoryFallback story={story}/>
    }
)

export {makeDynamicStoryComponent, StoryComponentFactoryOptions}