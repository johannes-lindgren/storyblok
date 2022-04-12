import {NextApiRequest, NextApiResponse} from "next";
import {validatePreviewToken} from "@johannes-lindgren/storyblok-js";

export type PreviewSuccessResponseBody = {
    message: string
}
export type PreviewErrorResponseBody = {
    errors: string[]
}
export type PreviewResponseBody = PreviewSuccessResponseBody | PreviewErrorResponseBody

export const redirectPreview = (req: NextApiRequest, res: NextApiResponse, pathOrQueryParam: string) => {
    const param = req.query[pathOrQueryParam]
    const fullSlug = typeof param === 'string' ? param : param.join('/')

    // Keep the query parameters in the redirected request
    const params = req.url?.split('?') ?? ''
    const queryParams = params[1]

    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    res.redirect(`/${fullSlug}${queryParams ? `?${queryParams}` : ''}`)
}

export const makeDraftPreviewHandler = (pathOrQueryParam: string, previewToken: string | undefined) => (
    async (req: NextApiRequest, res: NextApiResponse<PreviewResponseBody>) => {
        // Check the secret and next parameters
        // This secret should only be known to this API route and the CMS
        if (!validatePreviewRequest(req, previewToken)) {
            res.status(401).json({
                errors: ['Invalid token']
            })
            return
        }

        // Enable Preview Mode by setting the cookies
        res.setPreviewData({})

        // Set cookie to None, so it can be read in the Storyblok iframe
        setPreviewCookies(res)

        redirectPreview(req, res, pathOrQueryParam)
    }
)

export const makePublishedPreviewHandler = (pathOrQueryParam: string) => (
    async (req: NextApiRequest, res: NextApiResponse<PreviewResponseBody>) => {
        // Exit the current user from "Preview Mode". This function accepts no args.
        res.clearPreviewData()

        // Set cookie to None, so it can be read in the Storyblok iframe
        setPreviewCookies(res)

        redirectPreview(req, res, pathOrQueryParam)
    }
)

export const validatePreviewRequest = (req: NextApiRequest, previewToken: string | undefined): boolean => {
    const spaceId = req.query['_storyblok_tk[space_id]']
    const timestamp = req.query['_storyblok_tk[timestamp]']
    const token = req.query['_storyblok_tk[token]']
    if (
        typeof spaceId !== 'string' ||
        typeof timestamp !== 'string' ||
        typeof token !== 'string'
    ) {
        return false
    }
    return validatePreviewToken(spaceId, parseInt(timestamp), token, previewToken)
}

export const setPreviewCookies = (res: NextApiResponse) => {
    const cookies = res.getHeader('Set-Cookie')
    if (!Array.isArray(cookies)) {
        return res.status(500).json({errors: ["'Set-Cookies' header not provided"]})
    }

    res.setHeader('Set-Cookie', cookies.map(
            (cookie) => cookie.replace('SameSite=Lax', 'SameSite=None;Secure')
        )
    )
}

