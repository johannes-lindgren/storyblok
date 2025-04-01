import {
  type Parser,
  array,
  equals,
  object,
  parseString,
  withDefault,
} from 'pure-parse'

export type TableContent = {
  fieldtype: 'table'
  thead: TableHeadContent[]
  tbody: TableRowContent[]
}

export type TableHeadContent = {
  component: '_table_head'
  value: string | undefined
}

export type TableRowContent = {
  component: '_table_row'
  body: TableColumnContent[]
}

export type TableColumnContent = {
  component: '_table_col'
  value: string | undefined
}

export const parseTableHeadContent = object<TableHeadContent>({
  component: equals('_table_head'),
  value: withDefault(parseString, undefined),
})

export const parseTableColumnContent = object<TableColumnContent>({
  component: equals('_table_col'),
  value: withDefault(parseString, undefined),
})

export const parseTableRowContent = object<TableRowContent>({
  component: equals('_table_row'),
  body: array(parseTableColumnContent),
})

export const tableContent = (): Parser<TableContent> =>
  object<TableContent>({
    fieldtype: equals('table'),
    thead: array(parseTableHeadContent),
    tbody: array(parseTableRowContent),
  })
