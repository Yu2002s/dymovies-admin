import request from '@/utils/request.js'
import type {User, UserAuth} from "@/api/user/types";
import type {BaseResponse} from "@/api/common";

export const reqLogin = (data: User) => request.post<never, BaseResponse<UserAuth>>('/admin/users/login', data)

export const reqUserInfo = () => request.get<never, BaseResponse<User>>(`/admin/users`)

// export const reqGetUserList = (data) => request.get<User[]>('/users/list', {params: data})
