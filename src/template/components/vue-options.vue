<template>

</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'VueOptions',
  props: {},
  data() {
    return {}
  },
  computed: {},
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created')
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    console.log('mounted')
  },
  beforeUnmount() {
    console.log('beforeDestroy')
  },
  unmounted() {
    console.log('destroyed')
  },
  activated() {
    console.log('activated')
  },
  deactivated() {
    console.log('deactivated')
  },
  methods: {}
})
</script>