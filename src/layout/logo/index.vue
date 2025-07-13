<template>
  <a class="logo" href="/">
    <el-image class="logo-img" src="/favicon.ico"></el-image>
    <h1 class="title" v-if="layoutStore.isExpand">冬雨影视后台管理面板</h1>
  </a>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

defineOptions({
  name: 'AppLogo',
})
</script>

<style lang="scss" scoped>
.logo {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &-img {
    width: 40px;
    height: 40px;
  }

  .title {
    margin-left: 10px;
    white-space: nowrap;
  }
}
</style>
