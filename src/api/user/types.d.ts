/**
 * 用户信息
 */
export type User = {
  username: string
  password: string
  avatar: string
}

/**
 * 登录表单所需的数据
 */
export type LoginForm = Pick<User, "username" | "password"> & {
  code: string
}

/**
 * 用户凭证信息
 */
export type UserAuth = {
  token: string
}
