<!-- SVG 图标组件 -->
<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color"/>
  </svg>
</template>

<script>
import path from "path";

/*
  vite.config.js
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(__dirname, 'src/icons')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]'
  })
  // mian.js
  import 'virtual:svg-icons-register'
*/
export default {
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#333',
    },
  },
  computed: {
    symbolId() {
      return `#${this.prefix}-${this.name}`
    }
  }

}
</script>

<style>
.svg-icon {
  height: 1.5em;
  width: 1.5em;
}
</style>
