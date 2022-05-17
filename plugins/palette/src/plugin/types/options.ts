/**
 * This file defines the contract for the input
 */
import Joi from "joi";

export type Options = {
    colors?: string[]
    columns?: number
    size?: 'small' | 'medium' | 'large'
    variant?: 'square' | 'circle' | 'dense'
}

const schema = Joi.object<Options>({
    colors: Joi.array().items(Joi.string().pattern(/#[0-9a-fA-F]{6}/)),
    columns: Joi.number().integer().min(1),
    size: Joi.string().valid('small', 'medium', 'large'),
    variant: Joi.string().valid('square', 'circle', 'dense'),
})

type MakeOptions = (options: Record<string, string | undefined>) => {
    value: undefined
    errorMessage: string
} | {
    value: Options
}

const makeOptions: MakeOptions = (options) => {
    const obj = {
        colors: options.colors?.split(',').map(s => s.trim()),
        size: options.size,
        columns: options.columns && parseInt(options.columns, 10),
        variant: options.variant,
    }
    const res = schema.validate(obj)
    return res.value ? {
        value: res.value
    } : {
        errorMessage: res.error.message
    }
}
