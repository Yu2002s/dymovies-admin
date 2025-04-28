import { defineStore } from 'pinia'
import type { TabPaneName } from 'element-plus'
import router from '@/router'

interface LayoutState {
  isExpand: boolean
  isRefresh: boolean
  navList: NavItem[]
}

interface NavItem {
  title: string
  path: string
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    isExpand: true,
    isRefresh: false,
    navList: [],
  }),
  getters: {
    currentNav() {
      return router.currentRoute.value.path
    },
  },
  actions: {
    changeExpand() {
      this.isExpand = !this.isExpand
    },
    removeNav(path: TabPaneName) {
      if (this.navList.length === 1) {
        router.push('/')
      }
      const index = this.navList.findIndex((item) => item.path === path)
      this.navList.splice(index, 1)
      if (this.currentNav === path) {
        if (index - 1 >= 0) {
          router.push(this.navList[index - 1].path)
        } else {
          router.push(this.navList[index].path)
        }
      }
    },
    addNav(nav: NavItem) {
      if (nav.path === '/login') {
        // 登录页面不进行添加
        return
      }
      if (this.navList.some((item) => item.path === nav.path)) {
        return
      }
      this.navList.push(nav)
    },
  },
})
