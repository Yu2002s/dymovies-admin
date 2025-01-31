<script setup lang="ts">
import type {RouteRecordRaw} from "vue-router";

defineOptions({
  name: 'MenuList'
})

interface MenuProps {
  menuList: RouteRecordRaw[]
}

defineProps<MenuProps>()

</script>

<template>
  <template v-for="item in menuList" :key="item.path">
    <template v-if="!item.children && !item.meta?.hidden">
      <el-menu-item :index="item.path">
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <template v-else-if="item.children && item.children.length">
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta?.icon"></component>
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </template>
        <MenuList :menu-list="item.children" />
      </el-sub-menu>
    </template>
  </template>
</template>

<style scoped lang="scss"></style>
