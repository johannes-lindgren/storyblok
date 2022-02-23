import {LinkMark, Mark as MarkData, MarkType, StyledMark} from "@johannes-lindgren/storyblok-js";
import {createElement, Fragment, FunctionComponent} from "react";

type MarkComponent<M extends MarkData = MarkData> = FunctionComponent<{ mark: M }>

type MarkComponentMapping = {
    // These will be required and show in intellisense
    bold: MarkComponent
    italic: MarkComponent
    code: MarkComponent
    strike: MarkComponent
    underline: MarkComponent
    styled: MarkComponent<StyledMark>
} & Record<string, MarkComponent<any>> // Allow for potentially unknown mark types

const StyledMarkComponent: MarkComponent<StyledMark> = ({mark, children}) => (
    <span className={mark.attrs.class}>{children}</span>
)

const LinkMarkComponent: MarkComponent<LinkMark> = ({mark, children}) => {
    const href = typeof mark.attrs.href !== 'string' ? undefined : (
        mark.attrs.linktype === 'email' ? (
            `mailto:${mark.attrs.href}`
        ) : (
            mark.attrs.href
        )
    )
    return (
        <a
            href={href}
            target={mark.attrs.target ?? undefined}
        >
            {children}
        </a>
    )
}

const makeMarkComponent = (element: string): MarkComponent => ({children}) => createElement(element, undefined, children)

const markComponentMapping: MarkComponentMapping = {
    bold: makeMarkComponent('strong'),
    italic: makeMarkComponent('em'),
    code: makeMarkComponent('code'),
    strike: makeMarkComponent('strike'),
    underline: makeMarkComponent('u'),
    styled: StyledMarkComponent,
    link: LinkMarkComponent,
}

const getMarkComponent = (markType: MarkType): MarkComponent => {
    return markComponentMapping[markType] ?? Fragment
}

const Mark: MarkComponent = ({mark, children}) => {
    const Component = getMarkComponent(mark.type) ?? Fragment
    return (
        <Component mark={mark}>{children}</Component>
    )
}

export {Mark}