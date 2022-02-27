import {Block} from "../index";

export type Table = {
    thead: TableHeaderCell[]
    tbody: TableRow[]
} | "" // NOTE: The field value can be an empty string

export type TableHeaderCell = Block<{}, '_table_head'> & {
    value: string
}

export type TableRow = Block<{}, '_table_row'> & {
    body: TableCell[]
}

export type TableCell = Block<{}, '_table_col'> & {
    value: string
}