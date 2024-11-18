import { createPluginActions } from './createPreviewPluginActions'
import { PluginLoadedMessage } from '../../messaging'

const mock = () => ({
  uid: 'abc',
  postToContainer: jest.fn(),
  onUpdateState: jest.fn(),
})

describe('createPluginActions', () => {
  describe('initial call', () => {
    it('does not send any message to the container', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      createPluginActions(postToContainer, onUpdateState)
      expect(postToContainer).not.toHaveBeenCalled()
    })
  })
  describe('setPluginReady()', () => {
    it('send a message to the container to receive the initial state', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setPluginReady },
      } = createPluginActions(postToContainer, onUpdateState)
      setPluginReady()
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          event: 'loaded',
        } satisfies Partial<PluginLoadedMessage>),
      )
    })
  })
})
