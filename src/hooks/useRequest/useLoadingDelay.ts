import { computed, ref } from 'vue'

/**
 * 带 delay 功能的 loading 状态管理
 * @param ms 等待的毫秒数量
 * @returns
 */
export const useLoadingDelay = (ms = 0) => {
  const state = ref(false)
  // 为了让 loading 只读，不能写入，只能通过提供的函数写入
  const loading = computed(() => state.value)
  let _loadingTimer: ReturnType<typeof setTimeout> = 0 as any

  // 写 true 要等一会儿才生效
  const setTrue = () => {
    _loadingTimer && clearTimeout(_loadingTimer)
    if (ms > 0) {
      _loadingTimer = setTimeout(() => {
        state.value = true
      }, ms)
    }
    else {
      state.value = true
    }
  }

  // 写 false 是立即生效
  const setFalse = () => {
    _loadingTimer && clearTimeout(_loadingTimer)
    state.value = false
  }

  return {
    loading,
    setTrue,
    setFalse
  }
}
