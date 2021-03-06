import {makeBlockComponent} from "@src/block/make-block-component";
import {usePreview} from "@src/context";
import {Alert} from "@src/helpers/alert";

const DefaultBlockFallback = makeBlockComponent( ({block}) => {
    const preview = usePreview()
    return (
        <Alert level={preview ? 'error' : 'warning'}>
            Unable to render content. {preview && <>No mapping between the block component type `{block.component}` and a React
            component has been defined.</>}
        </Alert>
    )
})

export { DefaultBlockFallback }