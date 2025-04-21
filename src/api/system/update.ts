import request from '@/utils/request.ts'
import type { BaseResponse, Page, PageParams } from '@/api/common'
import type { AppUpdate } from '@/api/system/types'

export const reqGetUpdateList = (params: PageParams) =>
  request.get<never, BaseResponse<Page<AppUpdate>>>('/admin/updates', {
    params,
  })

export const reqAddUpdate = (data: AppUpdate) =>
  request.post<never, BaseResponse<string>>('/admin/updates', data)

export const reqUpdateAppUpdate = (data: AppUpdate) =>
  request.put<never, BaseResponse<string>>('/admin/updates', data)

export const reqDeleteUpdate = (id: number) =>
  request.delete<never, BaseResponse<string>>(`/admin/updates/${id}`)
