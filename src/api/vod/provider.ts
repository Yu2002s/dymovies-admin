import request from "@/utils/request.ts";
import type {BaseResponse} from "@/api/common";
import type {VodProvider} from "@/api/vod/type";

export const reqGetVodProviders = () => request.get<never, BaseResponse<VodProvider[]>>("/vodProviders")
