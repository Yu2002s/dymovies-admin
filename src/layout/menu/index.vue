<script setup lang="ts">
import type {RouteRecordRaw} from "vue-router";
import {Icon} from '@iconify/vue'

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
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <Icon :icon="item.meta?.icon" ></Icon>
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <template v-else-if="item.children && item.children.length">
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <Icon :icon="item.meta?.icon" ></Icon>
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </template>
        <MenuList :menu-list="item.children" />
      </el-sub-menu>
    </template>
  </template>
</template>

<style scoped lang="scss"></style>
