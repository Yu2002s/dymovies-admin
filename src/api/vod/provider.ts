import request from "@/utils/request.ts";
import type {BaseResponse} from "@/api/common";
import type {VodProvider} from "@/api/vod/type";

/**
 * 获取影片的供应商列表
 */
export const reqGetVodProviders = () => request.get<never, BaseResponse<VodProvider[]>>("/vodProviders")
