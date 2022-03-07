<template>
  <div class="home">
    <h1 class="banner">
      欢迎使用 Vue3 模板生成的后台管理系统。如有疑问，请及时与我们联系~
    </h1>

    <div>{{ username }}</div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const store = useStore()
    const username = computed(() => store.state.name)

    return { username }
  }
})
</script>

<style lang="less" scoped>

</style>
