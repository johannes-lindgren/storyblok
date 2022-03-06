import {makeBlockComponent} from "@johannes-lindgren/storyblok-react";
import {Alert, AlertColor, AlertTitle} from "@mui/material";
import {RichText} from "@src/components/dynamic-components";
import {RichText as RichTextData} from "@johannes-lindgren/storyblok-js"

export type AdmonitionType = 'tip' | 'note' | 'warning' | 'important'

export type AdmonitionData = {
    type: AdmonitionType
    body: RichTextData
}

export const Admonition = makeBlockComponent<AdmonitionData>(({block}) => (
    <Alert severity={getColor(block.type)}>
        <AlertTitle>{getTitle(block.type)}</AlertTitle>
        <RichText richText={block.body}/>
    </Alert>
), 'admonition')

const admonitionType2AlertColor: Record<AdmonitionType, AlertColor> = {
    tip: 'success',
    note: 'info',
    warning: 'warning',
    important: 'error',
}

const admonitionType2Title: Record<AdmonitionType, string> = {
    tip: 'Tip',
    note: 'Note',
    warning: 'Warning',
    important: 'important',
}

const defaultType = 'note'

const getColor = (type?: AdmonitionType): AlertColor => admonitionType2AlertColor[type ?? defaultType]
const getTitle = (type?: AdmonitionType): string => admonitionType2Title[type ?? defaultType]