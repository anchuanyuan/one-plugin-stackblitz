<template>
    <div>

    </div>
</template>

<script setup>
import { ref, reactive, computed,watchEffect, watch, onMounted, onBeforeMount, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
const data = ref(1)
const obj = reactive({ a: 1 })
const newData = computed(() => {
    return data.value++
})
watch(() => obj.a, (value, newValue) => {
    console.log(value, newValue)
})
watchEffect(() => {
    console.log(data.value)
})
onBeforeMount(() => { })

onMounted(() => { })

onBeforeUnmount(() => { })

onActivated(() => { })

onDeactivated(() => { })

</script>