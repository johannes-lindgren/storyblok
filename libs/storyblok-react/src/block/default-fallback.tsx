import {BlockComponent} from "@src/block/block-component";
import {usePreview} from "@src/story";
import {Alert} from "@src/helpers/alert";

const DefaultFallback: BlockComponent = ({block}) => {
    const preview = usePreview()
    return (
        <Alert level={preview ? 'error' : 'warning'}>
            Unable to render content. {preview && <>No mapping between the block component type `{block.component}` and a React
            component has been defined.</>}
        </Alert>
    )
}

export {DefaultFallback}