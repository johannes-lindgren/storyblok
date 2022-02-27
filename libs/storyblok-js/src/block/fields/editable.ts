import {Block} from "../index";

export type Editable = {
    name: string,
    space?: string,
    uid: string, // uid of block
    id: string // Id of story
}

export const getEditable = (block: Block): Editable | undefined => {
    if(typeof block._editable === 'undefined'){
        return undefined
    }
    const pattern = /<!--#storyblok#(?<json>.*)-->/
    const optionsJson = pattern.exec(block._editable)?.groups?.json
    if(typeof optionsJson === 'undefined'){
        return undefined
    }
    return JSON.parse(optionsJson) as Editable
}