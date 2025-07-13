<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout.ts'
import { useUserStore } from '@/stores/user.ts'
import Logo from '@/layout/logo/index.vue'
import Menu from '@/layout/menu/index.vue'
import Toolbar from '@/layout/toolbar/index.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import menu from '@/router/routes'

const route = useRoute()
const layoutStore = useLayoutStore()
const userStore = useUserStore()
const flag = ref(true)
watch(
  () => layoutStore.isRefresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<template>
  <el-config-provider :locale="zhCn">
    <el-container class="app-container" style="height: 100vh">
      <el-aside :class="{ expand: layoutStore.isExpand }" v-if="userStore.isLogin">
        <el-scrollbar>
          <Logo />
          <el-menu router :default-active="route.path" :collapse="!layoutStore.isExpand">
            <Menu :menu-list="menu" />
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container direction="vertical">
        <Toolbar v-if="userStore.isLogin" />
        <el-main>
          <RouterView v-slot="{ Component }">
            <template v-if="Component">
              <Transition mode="out-in">
                <component :is="Component" v-if="flag"></component>
              </Transition>
            </template>
          </RouterView>
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style scoped lang="scss">
.app-container {
  .el-aside {
    overflow: hidden;
    width: 64px;
    transition: width 0.4s ease;

    &.expand {
      width: 250px;
    }
  }

  .el-main {
    --el-main-padding: 0;

    .el-scrollbar {
      height: calc(100vh - 115px);

      &.fill {
        height: 100vh;
      }

      ::v-deep(.el-scrollbar__view) {
        height: 100%;
      }
    }

    .v-enter-active,
    .v-leave-active {
      transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
      opacity: 0;
    }
  }

  .el-menu {
    height: calc(100vh - 50px);
  }
}
</style>
