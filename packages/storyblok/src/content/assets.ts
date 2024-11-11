import { array, Parser } from 'pure-parse'
import { AssetContent, assetContent } from './asset'

export const assetsContent = (): Parser<AssetContent[]> => array(assetContent())
