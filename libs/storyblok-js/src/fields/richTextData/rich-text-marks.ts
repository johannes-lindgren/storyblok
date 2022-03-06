import {AttributeProp} from "./rich-text-nodes";

/**
 * Text Node Mark Types
 */

export type SimpleMark<T extends string> = { type: T }
export type ItalicMark = SimpleMark<'italic'>
export type BoldMark = SimpleMark<'bold'>
export type StrikeMark = SimpleMark<'strike'>
export type UnderlineMark = SimpleMark<'underline'>
export type CodeMark = SimpleMark<'code'>
export type StyledMark = SimpleMark<'styled'> & AttributeProp<{
    class: string
}>
type AnchorTarget =
    | '_self'
    | '_blank'
    | '_parent'
    | '_top'
    | string

export type StoryLinkMark = SimpleMark<'link'> & AttributeProp<{
    href: string | 0,
    uuid: string | null,
    anchor: null,
    target: AnchorTarget | null,
    linktype: 'story'
}>
export type UrlLinkMark = SimpleMark<'link'> & AttributeProp<{
    href: string | 0,
    uuid: null,
    anchor: null,
    target: AnchorTarget | null,
    linktype: 'url'
}>
export type EmailLinkMark = SimpleMark<'link'> & AttributeProp<{
    href: string | 0,
    uuid: null,
    anchor: null,
    target: AnchorTarget | null,
    linktype: 'email'
}>
export type AssetLinkMark = SimpleMark<'link'> & AttributeProp<{
    href: string | 0,
    uuid: null,
    anchor: null,
    target: AnchorTarget | null,
    linktype: 'asset'
}>
export type LinkType = LinkMark['attrs']['linktype']
export type LinkMark = StoryLinkMark | UrlLinkMark | EmailLinkMark | AssetLinkMark
export type Mark = ItalicMark | BoldMark | StrikeMark | UnderlineMark | CodeMark | StyledMark | LinkMark
export type MarkType = Mark['type'] | string