import type { Vod, VodQueryParams } from '@/api/vod/types.d.ts'
import request from '@/utils/request.ts'
import type { BaseResponse, Page } from '@/api/common'

export const reqGetVodList = (params: VodQueryParams) =>
  request.get<never, BaseResponse<Page<Vod>>>('/admin/vods', {
    params,
  })
