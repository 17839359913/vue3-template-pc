<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible :trigger="null" class="the-sider">
    <a class="logo" href="/">
      <img src="https://conan-online.fbcontent.cn/conan-operation-resource/2zmrbpc4x4pi2khybt.svg">
      <div v-show="!collapsed" class="title">xx系统</div>
    </a>

    <Menu />

    <div class="trigger-container">
      <!-- todo 折叠后显示成一个头像 -->
      <UserInfo v-show="!collapsed" />
      <menu-unfold-outlined v-if="collapsed" class="trigger" @click="toggle" />
      <menu-fold-outlined v-else class="trigger" @click="toggle" />
    </div>
  </a-layout-sider>
</template>

<script lang="ts">
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue'
import Menu from './Menu.vue'
import UserInfo from './UserInfo.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Sider',
  components: {
    Menu,
    UserInfo,
    MenuUnfoldOutlined,
    MenuFoldOutlined
  },
  setup() {
    const collapsed = ref<boolean>(false)
    const selectedKeys = ref<string[]>(['1'])

    const toggle = () => collapsed.value = !collapsed.value

    return {
      collapsed,
      selectedKeys,

      toggle
    }
  }
})
</script>

<style lang="less" scoped>
::v-deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 8px;
  .title {
    color: #fff;
    margin-left: 16px;
    overflow: visible;
    white-space: nowrap;
  }
}

.trigger-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #002140;

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    color: #fff;

    &:hover {
      color: #1890ff;
    }
  }
}

</style>
