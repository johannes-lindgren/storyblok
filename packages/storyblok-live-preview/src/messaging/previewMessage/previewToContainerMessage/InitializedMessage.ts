export type InitializedMessage = {
  action: 'initialized'
  config: {
    customParent: string
    initOnlyOnce: boolean
    preventClicks: boolean
    resolveRelations: string[]
  }
}

export const initializedMessage = (): InitializedMessage => ({
  action: 'initialized',
  config: {
    customParent: '',
    initOnlyOnce: false,
    preventClicks: false,
    resolveRelations: [],
  },
})
