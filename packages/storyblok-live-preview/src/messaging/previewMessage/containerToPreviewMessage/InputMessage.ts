import { hasKey } from '../../../utils'
import { Story } from '../../pluginMessage'

export type InputMessage = {
  action: 'input'
  story: Story
}

export const isInputMessage = (data: unknown): data is InputMessage =>
  hasKey(data, 'action') && data.action === 'input'
