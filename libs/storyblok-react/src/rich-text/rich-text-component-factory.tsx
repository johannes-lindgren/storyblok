import {RichTextNodeComponent} from "@src/rich-text/rich-text-node-component";
import {DefaultFallback} from "@src/rich-text/default-fallback";
import {
    BlockNode,
    BlockquoteNode,
    BulletListNode,
    CodeBlockNode,
    DocNode,
    HeadingNode,
    HorizontalRuleNode,
    ImageNode,
    ListItemNode,
    OrderedListNode,
    ParagraphNode,
    TextNode
} from "@johannes-lindgren/storyblok-js";
import {RichTextComponent} from "@src/rich-text/rich-text-component";
import {
    Blockquote,
    BulletList,
    CodeBlock,
    Doc,
    Heading,
    HeardBreakRule,
    HorizontalRule,
    Image,
    ListItem,
    OrderedList,
    Paragraph,
    Text
} from "@src/rich-text/default-rich-text-node-components";

// This type defines a mapping between rich text node 'type' and a component
type RichTextComponentMapping = Record<string, RichTextNodeComponent<any>> & {
    doc: RichTextNodeComponent<DocNode>
    heading: RichTextNodeComponent<HeadingNode>
    text: RichTextNodeComponent<TextNode>
    paragraph: RichTextNodeComponent<ParagraphNode>
    ordered_list: RichTextNodeComponent<OrderedListNode>
    bullet_list: RichTextNodeComponent<BulletListNode>
    list_item: RichTextNodeComponent<ListItemNode>
    blockquote: RichTextNodeComponent<BlockquoteNode>
    code_block: RichTextNodeComponent<CodeBlockNode>
    horizontal_rule: RichTextNodeComponent<HorizontalRuleNode>
    image: RichTextNodeComponent<ImageNode>
    blok: RichTextNodeComponent<BlockNode>
}

type RichTextComponentFactoryOptions = {
    mappingOverride?: Partial<RichTextComponentMapping>,
    Fallback?: RichTextNodeComponent,
}

type RichTextTextComponentFactory = (options?: RichTextComponentFactoryOptions) => RichTextComponent

/**
 * Creates a component for rendering rich text. Use this if you need to render blocks within rich text content.
 */
const makeRichTextComponent: RichTextTextComponentFactory = ({
                                                                 mappingOverride = {},
                                                                 Fallback = DefaultFallback
                                                             } = {}) => {
    const DefaultMapping = {
        doc: Doc,
        heading: Heading,
        text: Text,
        paragraph: Paragraph,
        list_item: ListItem,
        ordered_list: OrderedList,
        bullet_list: BulletList,
        blockquote: Blockquote,
        code_block: CodeBlock,
        horizontal_rule: HorizontalRule,
        hard_break: HeardBreakRule,
        image: Image,
        blok: Fallback,
    }

    const Mapping: RichTextComponentMapping = {
        ...DefaultMapping,
        ...mappingOverride,
    }

    const DynamicRichTextNode: RichTextNodeComponent = ({node, RichTextNode}) => {
        const Component = (node && Mapping[node.type]) ?? Fallback
        return (
            <Component node={node} RichTextNode={RichTextNode}/>
        )
    }

    return ({richText}: { richText?: DocNode }) => (
            <Mapping.doc node={richText ?? {type: 'doc'}} RichTextNode={DynamicRichTextNode}/>
    )
}

export {makeRichTextComponent, RichTextComponentFactoryOptions, RichTextComponentMapping};