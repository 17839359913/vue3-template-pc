import { ref, Ref, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash.debounce'
import { useResizeObserver } from '@vueuse/core'
import useTableAutoHeight from './useTableAutoHeight'

export default function useTableResizeObserve(tableSelector: string, pagination:Ref<any>, heightSelfAdaption:Ref<boolean>) {
  const scrollY = ref(0)
  let resizeObserver: {
    isSupported: boolean | undefined
    stop: () => void
  } | null = null

  const initResizeObserver = (selector: string) => {
    const { getTableWrapperHeight } = useTableAutoHeight(
      selector,
      !!pagination
    )

    const autoHeight = () => {
      const tableWrapperHeight = getTableWrapperHeight()
      console.log('tableWrapperHeight', tableWrapperHeight)
      tableWrapperHeight && (scrollY.value = tableWrapperHeight)
    }
    if (heightSelfAdaption) {
      autoHeight()
      resizeObserver = useResizeObserver(
        document.documentElement,
        debounce(autoHeight, 100)
      )
    }
  }

  onMounted(() => {
    /* 真实dom渲染后才能准确计算高度 */
    initResizeObserver(tableSelector)
  })

  onBeforeUnmount(() => {
    resizeObserver !== null && resizeObserver.stop()
  })

  return {
    scrollY
  }
}
