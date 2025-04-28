import request from '@/utils/request.ts'
import type { BaseResponse } from '@/api/common'
import type { VodType } from '@/api/vod/types'

export const reqGetVodTypes = (flag?: string) =>
  request.get<never, BaseResponse<VodType[]>>('/admin/vodTypes', {
    params: {
      flag,
    },
  })

export const reqUpdateVodType = (data: VodType) =>
  request.put<never, BaseResponse<VodType>>('/admin/vodTypes', data)

export const reqAddVodType = (data: VodType) =>
  request.post<never, BaseResponse<VodType>>('/admin/vodTypes', data)

export const reqGetVodParentTypes = (flag?: string) =>
  request.get<never, BaseResponse<VodType[]>>('/vodTypes/parent', {
    params: {
      flag,
    },
  })
