import type {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/home/index.vue";

export default [
  {
    name: 'home',
    path: '/',
    component: HomeView,
    meta: {
      title: '主页',
      icon: "ep-cpu"
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
      icon: 'ep-memo'
    },
    children: [
      {
        name: 'collectList',
        path: '/collect/list',
        component: () => import('@/views/collect/list.vue'),
        meta: {
          title: '采集列表',
          icon: 'ep-suitcase'
        }
      },
      {
        name: 'provider',
        path: '/collect/provider',
        component: () => import('@/views/collect/provider.vue'),
        meta: {
          title: '采集源管理',
          icon: 'ep-help'
        }
      },
      {
        name: 'job',
        path: '/collect/collect',
        component: () => import('@/views/collect/class.vue'),
        meta: {
          title: '采集类列表',
          icon: 'ep-guide'
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
      icon: 'ep-video-camera'
    },
    children: [
      {
        name: 'vodList',
        path: '/vod/list',
        component: () => import('@/views/vod/list.vue'),
        meta: {
          title: '影片列表',
          icon: 'ep-tickets'
        }
      },
      {
        name: 'vodType',
        path: '/vod/type',
        component: () => import('@/views/vod/type.vue'),
        meta: {
          title: '影片分类',
          icon: 'ep-orange'
        }
      }
    ]
  },
  {
    name: 'live',
    path: '/live',
    redirect: '/live/list',
    meta: {
      title: '直播管理',
      icon: 'ep-video-camera'
    },
    children: [
      {
        path: '/live/list',
        component: () => import('@/views/live/index.vue'),
        meta: {
          title: '直播列表',
          icon: 'ep-tickets'
        }
      }
    ]
  },
  {
    name: 'content',
    path: '/content',
    redirect: '/content/banner',
    meta: {
      title: '内容管理',
      icon: 'ep-reading'
    },
    children: [
      {
        path: '/content/banner',
        component: () => import('@/views/content/banner.vue'),
        meta: {
          title: '首页Banner管理',
          icon: 'ep-picture'
        }
      }
    ]
  },
  {
    name: 'system',
    path: '/system',
    redirect: '/system/config',
    meta: {
      title: '系统管理',
      icon: 'ep-setting'
    },
    children: [
      {
        name: 'config',
        path: '/system/config',
        component: () => import('@/views/system/config.vue'),
        meta: {
          title: '系统配置',
          icon: 'ep-operation'
        }
      },
      {
        name: 'update',
        path: '/system/app-version',
        component: () => import('@/views/system/appVersion.vue'),
        meta: {
          title: 'App版本管理',
          icon: 'ep-upload'
        }
      }
    ]
  }
] as RouteRecordRaw[]
