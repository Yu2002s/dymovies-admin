import {defineStore} from 'pinia'
import {reqLogin, reqUserInfo} from '@/api/user/index.js'
import type {LoginForm} from "@/api/user/types";
import router from '@/router/index.ts'

export const useUserStore = defineStore('user', {
  state: (): { username: string, avatar: string, token: string | null } => ({
    username: '',
    avatar: '',
    token: localStorage.getItem('token')
  }),
  getters: {
    isLogin(): boolean {
      return Boolean(this.token)
    }
  },
  actions: {
    async login(loginForm: LoginForm) {
      const result = await reqLogin(loginForm)

      if (result.code === 200) {
        const token = result.data.token
        this.token = token
        localStorage.setItem('token', token)
        return 'ok'
      }

      return Promise.reject(new Error(result.msg))
    },
    async userInfo() {
      const result = await reqUserInfo()
      if (result.code === 200) {
        const user = result.data
        this.username = user.username
        this.avatar = user.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    logout() {
      localStorage.removeItem('token')
      this.$reset()
      router.push({
        path: '/login', query: {
          redirect: window.location.pathname
        }
      })
    }
  }
})
