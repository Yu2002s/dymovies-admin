import type { BaseResponse } from '@/api/common'
import request from '@/utils/request.ts'
import type { VodVideo } from '@/api/vod/types.d.ts'

export const reqGetVodVideoList = (vid: number, flag: string) =>
  request.get<never, BaseResponse<VodVideo[]>>(`/vodVideos/${vid}`, {
    params: {
      flag,
    },
  })
