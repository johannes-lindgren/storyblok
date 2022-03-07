import {ImageAssetData} from "../fields";

// TODO generalize to accept all filters

type Options = { focal?: 'smart' | 'imageAsset', width?: number, height?: number }

const getImageSrc = (imageAsset: ImageAssetData, {focal, width, height}: Options = {}): string => (
    `${imageAsset.filename}/m/${width ?? 0}x${height ?? 0}/${getFocalParam(imageAsset, focal)}`
)

const getFocalParam = (imageAsset: ImageAssetData, focal?: 'smart' | 'imageAsset'): string => {
    if (typeof focal === 'undefined') {
        return ''
    }
    if (focal === 'smart') {
        return 'smart'
    }
    if (focal === 'imageAsset') {
        if (!imageAsset.focus) {
            return ''
        }
        return `filters:focal(${imageAsset.focus})`
    }
    return ''
}

export {getImageSrc}