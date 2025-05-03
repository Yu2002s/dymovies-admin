import request from '@/utils/request.ts'
import type {BaseResponse, Page, PageParams} from '@/api/common'
import type { Feedback } from '@/api/content/types'

export const reqGetFeedbacks = (params: PageParams) =>
  request.get<never, BaseResponse<Page<Feedback>>>('/feedbacks', {
    params,
  })

export const reqUpdateFeedback = (data: Feedback) =>
  request.post<never, BaseResponse<null>>('/feedbacks', data)
