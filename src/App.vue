<template>
  <a-config-provider :locale="locale">
    <a-layout class="app-container">
      <Sider class="app-sider" />
      <a-layout>
        <a-layout-header class="app-header">Header</a-layout-header>
        <a-layout-content class="app-content">
          <router-view />
        </a-layout-content>
        <!-- <a-layout-footer class="app-footer">Footer</a-layout-footer> -->
      </a-layout>
    </a-layout>

    <!-- global empty component mount -->
    <template #renderEmpty>
      <div class="empty-container">
        <img src="https://conan-online.fbcontent.cn/conan-operation-resource/2zmrbpc4xar5y7ufqu.svg">
        <p class="description">暂无数据</p>
      </div>
    </template>
  </a-config-provider>
</template>
<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import Sider from '@/components/layouts/Sider.vue'

export default {
  components: { Sider },
  setup() {
    return {
      locale: zhCN
    }
  }
}
</script>

<style lang="less" scoped>
.app-container {
  // overflow: auto;
  min-height: 100vh;

  .app-header {
    padding: 0 16px;
    background: #fff;
  }
  .app-content {
    margin: 16px;
    padding: 24px;
    background: #fff;
  }
}
.empty-container {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  .description {
    color: #8c8c8c;
    line-height: 22px;
    margin-top: 10px;
  }
}
</style>
