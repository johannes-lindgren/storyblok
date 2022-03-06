import {Block} from "../block";

export type EditableData = {
    name: string,
    space?: string,
    uid: string, // uid of block
    id: string // Id of story
}

export const getEditable = (block: Block): EditableData | undefined => {
    if(typeof block._editable === 'undefined'){
        return undefined
    }
    const pattern = /<!--#storyblok#(?<json>.*)-->/
    const optionsJson = pattern.exec(block._editable)?.groups?.json
    if(typeof optionsJson === 'undefined'){
        return undefined
    }
    return JSON.parse(optionsJson) as EditableData
}