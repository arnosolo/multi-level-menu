export interface MenuItemDoc {
  id: string
  title: string
  parentId?: string
  children?: MenuItemDoc[]
  showChildren?: boolean
}

export interface MenuItemProperty {
  title?: string
  showChildren?: boolean
  children?: MenuItemDoc[]
}
