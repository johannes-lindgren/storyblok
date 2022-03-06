import {NextApiRequest, NextApiResponse} from "next";

export type SuccessResponseBody = {
    message: string
}
export type ErrorResponseBody = {
    errors: string[]
}
export type ResponseBody = SuccessResponseBody | ErrorResponseBody

export type ApiRequestHandler = (req: NextApiRequest, res: NextApiResponse<ResponseBody>) => void