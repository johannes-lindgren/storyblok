import {
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
    RichTextNode,
    TextNode,
} from "@johannes-lindgren/storyblok-js";
import {createElement} from "react";
import {RichTextNodeComponent} from "@src/rich-text/rich-text-node-component";
import {Mark} from "@src/rich-text/rich-text-mark-component";

type RichTextNodesType = (props: { nodes?: RichTextNode[], RichTextNode: RichTextNodeComponent }) => JSX.Element

// Helper function: to write less code below
const RichTextNodes: RichTextNodesType = ({nodes, RichTextNode}): JSX.Element => {
    // Rich text nodes do not have ids, and React warns us if we omit the key. So we're  forced to
    //  either make up a uid with a React hook, or cheat by using the index as key
    return (
        <>
            {nodes?.map((node, index) => (
                <RichTextNode node={node} RichTextNode={RichTextNode} key={index}/>
            ))}
        </>
    )
}

/* Exports */

export const Doc: RichTextNodeComponent<DocNode> = ({node, RichTextNode}) => (
    <div><RichTextNodes nodes={node.content} RichTextNode={RichTextNode}/></div>
)
export const Heading: RichTextNodeComponent<HeadingNode> = ({node, RichTextNode}) => {
    const element = `h${node.attrs.level}`
    return createElement(element, undefined, <RichTextNodes nodes={node.content} RichTextNode={RichTextNode}/>)
}
export const Paragraph: RichTextNodeComponent<ParagraphNode> = ({node, RichTextNode}) => (
    <p><RichTextNodes nodes={node.content} RichTextNode={RichTextNode}/></p>
)
export const ListItem: RichTextNodeComponent<ListItemNode> = ({node, RichTextNode}) => (
    <li><RichTextNodes nodes={node.content} RichTextNode={RichTextNode}/></li>
)
export const BulletList: RichTextNodeComponent<BulletListNode> = ({node, RichTextNode}) => (
    <ul><RichTextNodes nodes={node.content} RichTextNode={RichTextNode}/></ul>
)
export const OrderedList: RichTextNodeComponent<OrderedListNode> = ({node, RichTextNode}) => (
    <ol><RichTextNodes nodes={node.content} RichTextNode={RichTextNode}/></ol>
)
export const Blockquote: RichTextNodeComponent<BlockquoteNode> = ({node, RichTextNode}) => (
    <blockquote><RichTextNodes nodes={node.content} RichTextNode={RichTextNode}/></blockquote>
)
export const CodeBlock: RichTextNodeComponent<CodeBlockNode> = ({node, RichTextNode}) => (
    <pre><code className={node.attrs.class}><RichTextNodes nodes={node.content} RichTextNode={RichTextNode}/></code></pre>
)
export const HorizontalRule: RichTextNodeComponent<HorizontalRuleNode> = (_) => (
    <hr/>
)
export const HeardBreakRule: RichTextNodeComponent<HorizontalRuleNode> = (_) => (
    <br/>
)
export const Image: RichTextNodeComponent<ImageNode> = ({node}) => (
    <img alt={node.attrs.alt} src={node.attrs.src} title={node.attrs.title}/>
)
export const Text: RichTextNodeComponent<TextNode> = ({node}) => (
    // Transform the list of marks into nested elements
    // [mark1, mark2] -> <Mark1><Mark2>text</Mark2></Mark1>
    (node.marks ?? []).reduce((children, mark) => (
            <Mark mark={mark}>{children}</Mark>
        ),
        <>{node.text}</>
    )
)