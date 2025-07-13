import { defineStore } from 'pinia'
import type { TabPaneName } from 'element-plus'
import router from '@/router'

/**
 * 布局状态
 */
interface LayoutState {
  /**
   * 是否展开菜单
   */
  isExpand: boolean
  /**
   * 是否刷新主界面区域
   */
  isRefresh: boolean
  /**
   * 顶部导航列表
   */
  navList: NavItem[]
}

/**
 * 导航项
 */
interface NavItem {
  /**
   * 导航标题
   */
  title: string
  /**
   * 导航路径
   */
  path: string
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    isExpand: true,
    isRefresh: false,
    navList: [],
  }),
  getters: {
    /**
     *  获取当前的导航路径
     * @returns 导航路径
     */
    currentNav() {
      return router.currentRoute.value.path
    },
  },
  actions: {
    /**
     * 改变菜单的展开状态
     */
    changeExpand() {
      this.isExpand = !this.isExpand
    },
    /**
     * 删除当前的导航项
     * @param path 路径
     */
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
    /**
     * 添加导航
     * @param nav 导航项
     */
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
