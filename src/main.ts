import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import Antd from 'ant-design-vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'ant-design-vue/dist/antd.less'
import '@/assets/style/global.less'
import STable from '@/components/Table/index.vue'
require('dayjs/locale/zh-cn')

const app = createApp(App)

app
  .use(store, key)
  .use(router)
  .use(Antd)
  .use(Vue3DraggableResizable)
app.component('STable', STable)

router.isReady().then(() => app.mount('#app'))
