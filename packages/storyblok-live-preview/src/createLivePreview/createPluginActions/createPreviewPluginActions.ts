/* eslint-disable functional/no-let */
import { PreviewPluginMessageCallbacks } from './createPluginMessageListener'
import { PreviewPluginData } from '../PreviewPluginData'
import { initializedMessage } from '../../messaging'
import { PreviewPluginActions } from '../PreviewPluginActions'
import { editMessage } from '../../messaging'

export type CreatePreviewPluginActions = (
  postToContainer: (message: unknown) => void,
  onUpdateState: (state: PreviewPluginData) => void,
) => {
  // These functions are to be called by the field plugin when the user performs actions in the UI
  actions: PreviewPluginActions
  // These functions are called when the plugin receives messages from the container
  messageCallbacks: PreviewPluginMessageCallbacks
}

export const createPluginActions: CreatePreviewPluginActions = (
  postToContainer,
  onUpdateState,
) => {
  // Tracks the full state of the plugin.
  //  Because the container doesn't send the full state in its messages, we need to track it ourselves.
  //  isModal and height is not included in the messages to the children and must thus be tracked here.
  //  In future improved versions of the plugin API, this should not be needed.
  let state: PreviewPluginData = {
    story: {
      content: {
        // TODO dummy...
        _uid: '',
        component: '',
      },
    },
    enteredBlockUid: undefined,
    hoveredBlockUid: undefined,
  }

  const messageCallbacks: PreviewPluginMessageCallbacks = {
    onInput: (message) => {
      state = {
        ...state,
        story: message.story,
      }
      onUpdateState(state)
    },
    onUnknownMessage: (data) => {
      // TODO remove side-effect, making functions in this file pure.
      //  perhaps only show this message in development mode?
      console.debug(
        `@storyblok/live-preview received a message from container of an unknown action type "${
          data.action
        }". You may need to upgrade the version of the @storyblok/live-preview library. Full message: ${JSON.stringify(
          data,
        )}`,
      )
    },
    onEnterComponent: (message) => {
      state = {
        ...state,
        enteredBlockUid: message.componentId ?? undefined,
      }
      onUpdateState(state)
    },
    onEnterEditMode: (message) => {
      state = {
        ...state,
        enteredBlockUid: message.blockId ?? undefined,
      }
      onUpdateState(state)
    },
    onHoverComponent: (message) => {
      state = {
        ...state,
        hoveredBlockUid: message.componentId ?? undefined,
      }
      onUpdateState(state)
    },
  }

  return {
    actions: {
      setPluginReady: () => postToContainer(initializedMessage()),
      openBlock: (data) => postToContainer(editMessage(data)),
    },
    messageCallbacks,
  }
}
