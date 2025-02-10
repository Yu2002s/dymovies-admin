import request from '@/utils/request.js'
import type {LoginForm, User, UserAuth} from "@/api/user/types";
import type {BaseResponse} from "@/api/common";

/**
 * 用户登录
 * @param data 登录用户信息
 */
export const reqLogin = (data: LoginForm) => request.post<never, BaseResponse<UserAuth>>('/admin/users/login', data)

/**
 * 获取用户信息
 */
export const reqUserInfo = () => request.get<never, BaseResponse<User>>(`/admin/users`)

// export const reqGetUserList = (data) => request.get<User[]>('/users/list', {params: data})
