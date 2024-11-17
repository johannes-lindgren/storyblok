export type EditMessage = {
  action: 'edit'
  dataC: DataC
  config: EditMessageConfig
}

type DataC = {
  name: string
  space: string
  uid: string
  id: string
}

export type EditMessageData = {
  spaceId: number
  storyId: number
  blockUid: string
  blockComponentName: string
}

export type EditMessageConfig = {
  customParent: string
  resolveRelations: string[]
  preventClicks: boolean
  initOnlyOnce: boolean
}

// {
//     name: componentName,
//     space: spaceId,
//     uid: blockUid,
//     id: storyId,
//   }

const dataC = (data: EditMessageData): DataC => ({
  space: data.spaceId.toString(10),
  id: data.storyId.toString(10),
  uid: data.blockUid,
  name: data.blockComponentName,
})

export const editMessage = (message: EditMessageData): EditMessage => ({
  action: 'edit',
  dataC: dataC(message),
  config: {
    customParent: '',
    initOnlyOnce: true,
    preventClicks: false,
    resolveRelations: [],
  },
})
