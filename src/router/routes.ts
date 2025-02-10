import type {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/home/index.vue";

export default [
  {
    name: 'home',
    path: '/',
    component: HomeView,
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
        component: () => import('@/views/job/list.vue'),
        meta: {
          title: 'Job列表',
        }
      },
      {
        name: 'job',
        path: '/collect/job',
        component: () => import('@/views/job/class.vue'),
        meta: {
          title: 'JobClass',
        }
      }
    ],
  },
  {
    name: 'vod',
    path: '/vod',
    redirect: '/vod/list',
    meta: {
      title: '影片管理',
    },
    children: [
      {
        name: 'list',
        path: '/vod/provider',
        component: () => import('@/views/vod/provider.vue'),
        meta: {
          title: '供应商管理',
        }
      }
    ]
  }
] as RouteRecordRaw[]
