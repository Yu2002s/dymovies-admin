import request from '@/utils/request.ts'
import type { BaseResponse } from '@/api/common'
import type { TvLive } from '@/api/live/types'

export const reqGetTvLiveList = () => request.get<never, BaseResponse<TvLive[]>>('/admin/tvLives')

export const reqUpdateTvLive = (data: TvLive) =>
  request.put<never, BaseResponse<null>>(`/admin/tvLives`, data)

export const reqDeleteTvLive = (id: number) =>
  request.delete<never, BaseResponse<null>>(`/admin/tvLives/${id}`)
