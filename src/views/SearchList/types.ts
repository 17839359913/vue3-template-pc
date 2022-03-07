export interface SearchParam {
  namePattern?: string
}

export interface RecordType {
  id: number
  name: string
  code: string
  positionLevelInfo: string
  canBeDeleted: boolean // 是否可被删除
}
