import {RefObject, useEffect, useRef} from 'react'
import {Block, EditableData, getEditableData, Story} from "@johannes-lindgren/storyblok-js";
import {useStory} from "@src/story/storyblok-context";

// Constructs the _editable property from the story id in the context
const makeEditableData = (block: Block, story: Story) => ({
    uid: block._uid,
    name: block.component,
    id: story.id.toString(),
})

const useEditableData = (block: Block): EditableData | undefined => {
    const story = useStory()
    // Blocks that were added since the previous save do not have the _editable field!
    // But the _editable field can be added as long as we have the block + the story id to which it belong
    // The story id can be fetched as long as the component is wrapped within a <StoryContext> provider
    return getEditableData(block) ?? (story && makeEditableData(block, story))
}

const useEditable = <HtmlElementType extends HTMLElement, >(block: Block): RefObject<HtmlElementType> => {
    const ref = useRef<HtmlElementType>(null)
    const editableData = useEditableData(block)

    useEffect(() => {
        if (
            typeof editableData === 'undefined' ||
            window.location === window.parent.location ||
            ref.current === null
        ) {
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

export {useEditable}