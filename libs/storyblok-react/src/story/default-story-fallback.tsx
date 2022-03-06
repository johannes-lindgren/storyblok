import {usePreview} from "@src/context";
import {Alert} from "@src/helpers/alert";
import {makeStoryComponent} from "@src/story/make-story-component";

const DefaultStoryFallback = makeStoryComponent( ({story}) => {
    const preview = usePreview()
    return (
        <Alert level={preview ? 'error' : 'warning'}>
            Unable to render content. {preview && <>No mapping between the block component type `{story.content.component}` and a React
            component has been defined.</>}
        </Alert>
    )
})

export { DefaultStoryFallback }