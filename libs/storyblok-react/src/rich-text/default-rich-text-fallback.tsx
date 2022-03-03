// TODO only render in preview mode: we don't want a huge red error box be displayed on the site
import {RichTextNodeComponent} from "@src/rich-text/rich-text-node-component";
import {Alert} from "@src/helpers/alert";
import {usePreview} from "@src/context";

export const DefaultRichTextFallback: RichTextNodeComponent = ({node}) => {
    const preview = usePreview()
    return (
        <Alert level={preview ? 'error' : 'warning'}>
            Unable to render text. {preview && <>No mapping between the node type `{node.type}` and a React component has been defined.</>}
        </Alert>
    )
}