import { defineConfig } from 'vite'
import  createVuePlugin  from '@vitejs/plugin-vue'
// import { createVuePlugin } from 'vite-plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Unocss from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { presetAttributify, presetUno } from 'unocss'
import * as path from "path";
const REPLACEMENT = `${path.resolve(__dirname, './src')}/`
export default defineConfig(({ mode }) => {
  return {
    base: './',
    server: {
      host: process.env.HOST,
      port: process.env.PORT,
      proxy: {
        '/dev-api': {
          target: 'http://localhost:8080',
          rewrite: (path) => path.replace(/^\/dev-api/, '')
        }
      }
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: REPLACEMENT
        }
      ]
    },
    plugins: [
      createVuePlugin(/* options */),
      Inspect(),
      Unocss({
        presets: [presetAttributify(), presetUno()]
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ]
  }
})
