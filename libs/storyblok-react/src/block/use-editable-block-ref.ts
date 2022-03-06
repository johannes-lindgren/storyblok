import {RefObject, useEffect, useRef} from 'react'
import {Block, Editable as EditableData, getEditable as getEditableData, Story} from "@johannes-lindgren/storyblok-js";
import {useStory} from "@src/context/story-context";
import {isDraft} from "@johannes-lindgren/storyblok-js";

// Constructs the _editable property from the story id in the context
const makeEditableData = (block: Block, story: Story): EditableData => ({
    uid: block._uid,
    name: block.component,
    id: story.id.toString(),
    space: getEditableData(story.content)?.space
})

const useEditableData = (block: Block): EditableData | undefined => {
    const story = useStory()

    // If the block has the _editable property -> return immediately
    const editableFromBlock = getEditableData(block)
    if(editableFromBlock){
        return editableFromBlock
    }

    // If the block doesn't have the _editable property, it could be of one of two reasons:
    // 1) The story is not a draft, but is published
    // 2) The block was added by the user, but hasn't been saved. These blocks lack the _editable field!


    // If we don' have the story, there's no chance to construct the _editable field
    if(!story){
        return
    }

    if(!isDraft(story)){
        // Case 1) The story is published -> we should not use the _editable property
        // TODO The story is not a draft, error!
        // TODO handle better
        console.warn(`The story in the current context is not in draft.`)
        return undefined
    }

    // Case 1) The story is draft and the block has not yet been saved -> we can reconstruct the _editable field as long as we have the block + the story id to which it belong
    return makeEditableData(block, story)
}

// TODO rename to useClickableBlockRef
const useEditableBlockRef = <HtmlElementType extends HTMLElement, >(block: Block): RefObject<HtmlElementType> => {
    const ref = useRef<HtmlElementType>(null)
    const editableData = useEditableData(block)

    useEffect(() => {
        if (
            typeof editableData === 'undefined' ||
            window.location === window.parent.location ||
            ref.current === null
        ) {
            // TODO handle better
            console.warn(`Cannot set element attributes for the Storyblok preview.`)
            return
        }

        ref.current.setAttribute('data-blok-c', JSON.stringify(editableData))
        ref.current.setAttribute('data-blok-uid', `${editableData.id}-${editableData.uid}`)
        ref.current.classList.add('storyblok__outline')

        return () => {
            // Cleanup
            if(ref.current === null){
                return
            }
            ref.current.removeAttribute('data-blok-c')
            ref.current.removeAttribute('data-blok-uid')
            ref.current.classList.remove('storyblok__outline')
        }
    })
    return ref
}

export {useEditableBlockRef}