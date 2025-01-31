import type {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/home/index.vue";

export default [
  {
    name: 'home',
    path: '/',
    component: () => HomeView,
    meta: {
      title: '主页'
    }
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/user/login.vue'),
    meta: {
      title: '登录',
      hidden: true,
    }
  },
  {
    name: 'collect',
    path: '/collect',
    redirect: '/collect/list',
    meta: {
      title: '采集管理',
    },
    children: [
      {
        name: 'collectList',
        path: '/collect/list',
        component: () => import('@/views/collect/list.vue'),
        meta: {
          title: '采集列表',
        }
      }
    ],
  }
] as RouteRecordRaw[]
