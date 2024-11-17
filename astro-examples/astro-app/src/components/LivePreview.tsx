import { useEffect, useState } from 'react'
import {
  createLivePreview,
  type PreviewPluginResponse,
} from '@johannes-lindgren/storyblok-live-preview'
import type { BlockContent } from '@johannes-lindgren/storyblok'
import { isString, isUndefined, withDefault } from 'pure-parse'
import { parseNumberFromString } from './parseNumberFromString.ts'

// Storyblok design tokens
const teal = '5, 128, 127'
const hoverOpacity = 0.1
const borderRadius = '5px'

const hoverStyles = `
  border-radius: ${borderRadius} !important;
  box-shadow: 0 0 0 1px rgb(${teal}) !important;
  background-color: rgba(${teal}, ${hoverOpacity}) !important;
`

export const LivePreview = () => {
  const state = useLivePreview()
  return (
    <style>{`
      *[data-sb-content-uid] {
        cursor: pointer;
        transition-property: background-color, box-shadow, border-radius;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
      }
      *[data-sb-content-uid=${JSON.stringify(state.hoveredBlockUid)}]:hover {
        ${hoverStyles}
      }
      ${
        state.hoveredBlockUid
          ? `
      *[data-sb-content-uid="${state.hoveredBlockUid}] {
        ${hoverStyles}
      }`
          : ''
      }
   `}</style>
  )
}

export const useLivePreview = () => {
  const [state, setState] = useState<PreviewPluginResponse>({
    type: 'loading',
  })
  useEffect(() => createLivePreview(setState), [])

  const [hoveredBlockUid, setHoveredBlockUid] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const spaceId = withDefault(
      parseNumberFromString,
      undefined,
    )(searchParams.get('_storyblok_tk[space_id]')).value
    const storyId = withDefault(
      parseNumberFromString,
      undefined,
    )(searchParams.get('_storyblok')).value
    if (isUndefined(spaceId) || isUndefined(storyId)) {
      console.error('Could not connect to Storyblok')
      return
    }

    const els = document
      .querySelectorAll('[data-sb-content-uid]')
      .values()
      .filter((el) => el instanceof HTMLElement)
    const handleClick = (event: MouseEvent) => {
      if (!(event.currentTarget instanceof HTMLElement)) {
        return
      }
      const contentUid = event.currentTarget.dataset.sbContentUid
      if (!isString(contentUid)) {
        return
      }
      event.stopPropagation()
      state.actions?.openBlock({
        blockUid: contentUid,
        spaceId: spaceId,
        storyId: storyId,
        blockComponentName: '',
      })
    }
    const handleHover = (event: MouseEvent) => {
      if (!(event.currentTarget instanceof HTMLElement)) {
        return
      }
      const contentUid = event.currentTarget.dataset.sbContentUid
      if (!isString(contentUid)) {
        return
      }
      setHoveredBlockUid(contentUid)
      event.stopPropagation()
    }
    els.forEach((el) => {
      el.addEventListener('click', handleClick)
      el.addEventListener('mouseover', handleHover)
    })
    return () => {
      els.forEach((el) => {
        el.removeEventListener('click', handleClick)
        el.removeEventListener('mouseover', handleHover)
      })
    }
  }, [state.actions?.openBlock])
  return {
    hoveredBlockUid: state.data?.hoveredBlockUid ?? hoveredBlockUid,
  }
}

export const contentAttributes = (component: BlockContent) => ({
  'data-sb-content-uid': component._uid,
})
