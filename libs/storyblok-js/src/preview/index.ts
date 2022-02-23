import sha1 from 'crypto-js/sha1';

export const validatePreviewToken = (spaceId: string, timestamp: number, token: string, previewToken: string | undefined): boolean => {
    const validationString = `${spaceId}:${previewToken}:${timestamp}`
    const validationToken = sha1(validationString).toString()
    return (
        token === validationToken
    ) && (
        timestamp > Math.floor(Date.now() / 1000) - 3600
    )
}

