export type Block<Fields extends Record<string, unknown> = Record<string, unknown>, Component extends string = string> =
    Record<string, unknown>
    & Partial<Fields>
    & {
    _uid: string
    component: Component
    _editable?: string
}