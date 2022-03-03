export type Block<Fields extends Record<string, unknown> = Record<string, unknown>> =
    Record<string, unknown>
    & Partial<Fields>
    & {
    _uid: string
    component: string
    _editable?: string
}