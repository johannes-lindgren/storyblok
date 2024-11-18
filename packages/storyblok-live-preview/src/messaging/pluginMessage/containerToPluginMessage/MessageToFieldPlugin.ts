import { hasKey } from '../../../utils'

export type MessageToFieldPlugin<Action extends string> = {
  action: Action
  uid: string
}

export const isMessageToPlugin = (
  obj: unknown,
): obj is MessageToFieldPlugin<string> =>
  hasKey(obj, 'action') &&
  typeof obj.action === 'string' &&
  hasKey(obj, 'uid') &&
  typeof obj.uid === 'string'
