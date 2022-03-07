<template>
  <a-menu v-model:selectedKeys="selectedKeys" class="menu" theme="dark" mode="inline" @select="menuSelect">
    <a-menu-item key="/">
      <HomeOutlined />
      <span>Home</span>
    </a-menu-item>
    <a-menu-item key="/search-list">
      <desktop-outlined />
      <span>SearchList</span>
    </a-menu-item>
    <a-sub-menu key="/sub1">
      <template #title>
        <span>
          <user-outlined />
          <span>User</span>
        </span>
      </template>
      <a-menu-item key="/3">Tom</a-menu-item>
      <a-menu-item key="/4">Bill</a-menu-item>
      <a-menu-item key="/5">Alex</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  HomeOutlined,
  DesktopOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {
    HomeOutlined,
    DesktopOutlined,
    UserOutlined
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const selectedKeys = ref<string[]>([route.path])

    const menuSelect = ({ item, key, selectedKeys }: any) => {
      console.log({ item, key, selectedKeys })
      router.push({ path: key })
    }

    return {
      selectedKeys,

      menuSelect
    }
  }
})
</script>

<style lang="less" scoped>
.menu {
  flex: 1
}
</style>
