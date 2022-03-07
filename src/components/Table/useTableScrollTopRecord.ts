import { onMounted, Ref, watch, onBeforeUnmount, nextTick } from 'vue'
import debounce from 'lodash.debounce'

/**
 * 记录table .ant-table-body 滚动后的scrollTop，使用场景：记录还原列表页滚动状态
 * @param {Ref<number>} scrollTop props.scrollTop
 * @param {string} tableSelector table选择器
 * @param {Ref<Record<string, unknown>[]>,} dataSource props.dataSource
 * @param {(event: 'update:scrollTop' | 'drag-change', ...args: any[]) => void} emit emit
 */
export default function useTableScrollTopRecord(
  scrollTop: Ref<number>,
  tableSelector: string,
  dataSource: Ref<Record<string, unknown>[]>,
  emit: (event: 'update:scrollTop' | 'drag-change', ...args: any[]) => void
) {
  let localeScrollTop = scrollTop.value

  const tableSelect = () =>
    document
      .querySelector(tableSelector)
      ?.querySelector('.ant-table-body')

  const onScroll = () => {
    const antTableBody = tableSelect()
    antTableBody && emit('update:scrollTop', antTableBody.scrollTop)
  }

  const onScrollDebounce = debounce(onScroll, 100)

  const bindUnbindScroll = (bind: boolean) => {
    if (scrollTop.value === undefined) return

    const antTableBody = tableSelect()
    if (!antTableBody) return
    bind
      ? antTableBody.addEventListener('scroll', onScrollDebounce)
      : antTableBody.removeEventListener('scroll', onScrollDebounce)
  }

  const initScrollTop = () => {
    if (scrollTop.value === undefined) return
    // 避免执行2次
    if (localeScrollTop === 0) return
    // dataSource 获取后再执行
    if (!(dataSource.value && dataSource.value.length > 0)) return

    nextTick(() => {
      const antTableBody = tableSelect()
      if (antTableBody) {
        antTableBody.scrollTop = scrollTop.value
        localeScrollTop = 0
      }
    })
  }

  watch(
    () => dataSource,
    () => {
      initScrollTop()
    },
    {
      deep: true
    }
  )

  onMounted(() => {
    bindUnbindScroll(true)
    initScrollTop()
  })

  onBeforeUnmount(() => bindUnbindScroll(false))
}
