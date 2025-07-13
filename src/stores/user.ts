import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo } from '@/api/user/index.js'
import type { LoginForm } from '@/api/user/types'
import router from '@/router/index.ts'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    username: '',
    avatar: '',
    token: localStorage.getItem('token'),
  }),
  getters: {
    /**
     * 判断用户是否登录了系统
     * @returns 是否登录
     */
    isLogin(): boolean {
      return Boolean(this.token)
    },
  },
  actions: {
    /**
     * 登录到系统
     * @param loginForm 登录信息
     * @returns 是否成功
     */
    async login(loginForm: LoginForm) {
      const result = await reqLogin(loginForm)

      if (result.code === 200) {
        const token = result.data.token
        this.token = token
        localStorage.setItem('token', token)
        return true
      }

      return Promise.reject(new Error(result.msg))
    },
    /**
     * 获取用户信息
     * @returns 如果获取失败将抛出异常
     */
    async userInfo() {
      const result = await reqUserInfo()
      if (result.code === 200) {
        const user = result.data
        this.username = user.username
        this.avatar = user.avatar
        return true
      }
      return Promise.reject(new Error(result.msg))
    },
    /**
     * 退出登录系统
     */
    logout() {
      localStorage.removeItem('token')
      this.$reset()
      router.push({
        path: '/login',
        query: {
          redirect: window.location.pathname,
        },
      })
    },
  },
})
