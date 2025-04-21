import request from '@/utils/request.ts'
import type { BaseResponse } from '@/api/common'
import type { VodBanner } from '@/api/content/types'

export const reqGetVodBanners = () =>
  request.get<never, BaseResponse<VodBanner[]>>('/admin/vodBanners')

export const reqAddVodBanner = (data: VodBanner) =>
  request.post<never, BaseResponse<null>>('/admin/vodBanners', data)

export const reqUpdateVodBanner = (data: VodBanner) =>
  request.put<never, BaseResponse<null>>('/admin/vodBanners', data)

export const reqDeleteVodBanner = (ids: number[]) =>
  request.delete<never, BaseResponse<null>>(`/admin/vodBanners`, { data: ids })
