
/**
 * This file defines the contract for the input
 */

export type Model = {
    plugin: string
}


export const isModel = (model: unknown): model is Model => {
    throw new Error("TODO implement")
}

export const assertModel = (model: unknown): asserts model is Model => {
    if(!isModel(model)){
        throw new Error('The given argument does not adhere to the options schema.')
    }
}