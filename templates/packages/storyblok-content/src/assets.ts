import { array, type Parser } from 'pure-parse'
import { type AssetContent, assetContent } from './asset'

export const assetsContent = (): Parser<AssetContent[]> => array(assetContent())
