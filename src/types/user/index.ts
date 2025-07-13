/**
 * 用户信息
 */
export interface UserInfo {
  /**
   * 用户名
   */
  username: string
  /**
   * 用户头像
   */
  avatar: string
  /**
   * 用户凭证信息
   */
  token: string | null
}
