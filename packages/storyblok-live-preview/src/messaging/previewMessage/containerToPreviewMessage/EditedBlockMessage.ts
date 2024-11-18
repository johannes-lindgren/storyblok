import { isMessageToPreviewPlugin } from './MessageToPreviewPlugin'

export type EditedBlockMessage = {
  action: 'editedBlok'
  breadcrumbs: {
    component: string
    _uid: string
    _parentfield?: string
    _parentindex?: number
    _parentName?: string
    _parentUid?: string
  }[]
  blok: {
    name: string
    space: string
    uid: string
    id: string
  }
  canAddBlocks: boolean
  canMoveForward: boolean
}

export const isEditedBlockMessage = (
  data: unknown,
): data is EditedBlockMessage =>
  isMessageToPreviewPlugin(data) && data.action === 'editedBlok'
