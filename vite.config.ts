import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>=0.25%')),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
  ],
  resolve: {
    alias :{
      "@": path.resolve(__dirname,'./src'),
    }
  },
  build: {
    cssMinify: 'lightningcss',
    assetsDir: 'ratchjob/assets',
//    需要与actions配合，暂时不能直接改
//    outDir: 'dist-wrap/src/dist',
  },
  server: {
    host: '0.0.0.0',
    port: 5175,
    proxy: {
      "/ratchjob/api": {
        target: "http://127.0.0.1:10848",
        changeOrigin: true,
      }
    }
  },
})
