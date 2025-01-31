import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({ isExpand: true, isRefresh: false }),
  actions: {}
})
