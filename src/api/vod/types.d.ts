import type { PageParams } from '@/api/common'

/**
 * 影片供应商
 */
export type VodProvider = {
  id?: number
  name: string
  url: string
  remark?: string
  weight?: number
}

export type VodQueryParams = {
  tid?: number
  keyword?: string
  flag?: string
} & PageParams

export type Vod = {
  id?: number
  name: string
  note: string
  flag: string
  pic: string
  tid: number
  updateTime: string
  vid: number
}

export type VodVideo = {
  id?: number
  vid: number
  name: string
  url: string
  flag: string
}

export type VodType = {
  id?: number
  pid?: number
  name: string
  flag: string
  status?: number
  weight?: number
  children?: VodType[]
}
