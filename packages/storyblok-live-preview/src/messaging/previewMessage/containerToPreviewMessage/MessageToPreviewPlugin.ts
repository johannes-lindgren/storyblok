import { hasKey } from '../../../utils'

export type MessageToPreviewPlugin<Action extends string> = {
  action: Action
}
export const isMessageToPreviewPlugin = (
  obj: unknown,
): obj is MessageToPreviewPlugin<string> =>
  hasKey(obj, 'action') && typeof obj.action === 'string'
