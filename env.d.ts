/// <reference types="vite/client" />

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-expect-error
//   const component: DefineComponent<object, object, never>
//   export default component
// }

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    icon?: string
    title: string
    // 是否隐藏
    hidden?: boolean
  }
}
