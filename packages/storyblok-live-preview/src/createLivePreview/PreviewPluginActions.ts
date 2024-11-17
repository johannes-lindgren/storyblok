import { EditMessageData } from '../messaging'

export type SetPluginReady = () => void
export type OpenBlock = (data: EditMessageData) => void

export type PreviewPluginActions = {
  setPluginReady: SetPluginReady
  openBlock: OpenBlock
}
