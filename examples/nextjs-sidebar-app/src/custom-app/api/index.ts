export const getState = (): string => {
    const state = process.env.NEXTAUTH_SECRET && base64Encode(process.env.NEXTAUTH_SECRET)
    if (!state) {
        throw new Error("Environmental variable 'NEXTAUTH_SECRET' is not defined")
    }
    return state
}

export function base64Encode(str: string){
    return Buffer.from(str).toString('base64')
}
export function base64Decode(str: string){
    return Buffer.from(str, 'base64').toString()
}