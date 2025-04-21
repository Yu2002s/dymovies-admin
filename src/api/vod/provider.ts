import request from "@/utils/request.ts";
import type {BaseResponse} from "@/api/common";
import type {VodProvider} from "@/api/vod/types.d.ts";

/**
 * 获取影片的供应商列表
 */
export const reqGetVodProviders = () => request.get<never, BaseResponse<VodProvider[]>>("/admin/vodProviders")

/**
 * 添加影片的供应商
 * @param data 具体数据
 */
export const reqAddVodProvider = (data: VodProvider) => request.post<never, BaseResponse<null>>("/admin/vodProviders", data)

export const reqUpdateVodProvider = (data: VodProvider) => request.put<never, BaseResponse<null>>("/admin/vodProviders", data)

export const reqDeleteVodProvider = (id: number) => request.delete<never, BaseResponse<null>>(`/admin/vodProviders/${id}`)
