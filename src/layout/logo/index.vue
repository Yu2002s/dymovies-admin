<template>
  <a class="logo" href="/">
    <el-icon :size="30">
      <EpVideoCameraFilled />
    </el-icon>
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

  .title {
    margin-left: 10px;
    white-space: nowrap;
  }
}
</style>
