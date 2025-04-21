import type { BaseResponse } from '@/api/common'
import request from '@/utils/request.ts'

export const reqGetVodConfig = () => request.get<never, BaseResponse<string>>('/admin/vodConfigs/flag')

export const reqUpdateVodConfig = (flag: string) =>
  request.put<never, BaseResponse<string>>(`/admin/vodConfigs/flag?flag=${flag}`)
