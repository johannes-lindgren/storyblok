import {Block} from "../index";

export type Table = {
    thead: TableHeaderCell[]
    tbody: TableRow[]
} | "" // NOTE: The field value can be an empty string

export type TableHeaderCell = Block<{component: '_table_head'}> & {
    value: string // Value is non-nullable
}

export type TableRow = Block<{component: '_table_row'}> & {
    body: TableCell[] // Body  is non-nullable
}

export type TableCell = Block<{component: '_table_col'}> & {
    value: string // Value is non-nullable
}