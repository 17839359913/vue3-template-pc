import axios, { AxiosInstance } from 'axios'
import { Button, notification } from 'ant-design-vue'
import { h } from 'vue'

/**
 * 无http请求最大时长
 */
const EXPIRE_TIME = 24 * 3600 * 1000 // 24小时
/**
 * http请求最后活跃时间
 */
let lastActiveTime = Date.now()

/**
 * 刷新页面组件（可以替换为任意回调函数）
 * @param message 信息
 */
const refreshTip = (message: string) => {
  notification.info({
    message,
    btn: h(
      Button,
      {
        type: 'primary',
        size: 'small',
        onClick: () => window.location.reload()
      },
      '点击刷新'
    ),
    duration: 0
  })
}

/**
 * 获取http请求最后活跃时间
 * @oaram axiosInstance 业务请求器实例
 */
const getLatestHttpActiveTime = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(config => {
    // 更新最后活跃时间
    // 活跃的定义：没有和后端交互
    lastActiveTime = Date.now()
    return config
  })
}

/**
 * 动态页面版本检测hook!
 * @oaram axiosInstance 业务请求器实例
 */
const useActiveVersionDetect = (axiosInstance: AxiosInstance) => {
  getLatestHttpActiveTime(axiosInstance)

  let newShown = false
  let activeShown = false

  const getHashFromHtml = (el: HTMLHtmlElement | Document) => {
    // 获取js script的src
    const scriptTags = el.getElementsByTagName('script')
    const scriptSrcs = Array.prototype.map.call(
      scriptTags,
      item => item.src
    ) as string[]

    // 正则获取app.[hash].js的hash
    // hashDigest: 'hex'时，app.js的hash为16进制
    // 用vue inspect --mode production查看webpack配置
    // filename与chunkFilename都是'js/[name].[contenthash:8].js'
    const appHashRegex = /.*app\.(?<hash>[0-9a-f]{8})\.js/
    return (
      scriptSrcs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.match(appHashRegex))
        .filter(item => item)[0]?.groups.hash
    )
  }

  const getLatestHash = async () => {
    const response = await axios
      .create()
      .get(`${window.location.protocol}//${window.location.host}/`, {
        headers: { 'Cache-Control': 'max-age=0', Accept: 'text/html' }
      })
    // 构建html
    const el = document.createElement('html')
    el.innerHTML = response.data
    return getHashFromHtml(el)
  }

  const getCurrentHash = () => getHashFromHtml(document)

  const checkNew = async () => {
    if (newShown) return
    const latestHash = await getLatestHash()
    const currentHash = getCurrentHash()
    if (latestHash !== currentHash) {
      newShown = true
      refreshTip('检测到页面有新版本部署，请尝试刷新页面')
    }
  }

  const checkActive = () => {
    if (activeShown) return
    if (Date.now() - lastActiveTime > EXPIRE_TIME) {
      activeShown = true
      refreshTip('你在当前页面停留时间较长，请尝试刷新页面查看最新数据')
    }
  }

  const checkNewActive = () => {
    checkNew()
    checkActive()
  }

  checkNewActive()
  setInterval(() => checkNewActive(), 1000 * 60)
}

export default useActiveVersionDetect
