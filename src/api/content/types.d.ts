export type VodBanner = {
  id?: number
  vid?: number
  name?: string
  pic?: string
  note?: string
  flag: string
  status?: number
  weight?: number
}

export type Feedback = {
  id?: number
  content: string
  contact?: string
  isRead?: number
  createTime?: string
}
