import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      // 自动导入的文件名
      imports: ['vue', 'vue-router'],
      // 指定生成.d.ts的位置
      dts: 'src/auto-imports.d.ts',
      // 需要自动导入的文件
      include: [/\.[tj]sx?$/, /\.vue$/],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }), // 自动注册图标组件
        IconsResolver({
          prefix: '', // 默认前缀是i
          enabledCollections: ['ep'], // 选择图标库集合 ep
        }),
      ],
      // 指定.d.ts生成的位置
      dts: 'src/components.d.ts',
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  server: {
    proxy: {
      ['/api']: {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
