import { ColumnProps } from 'ant-design-vue/lib/table/interface'
import { h, ref, computed, Ref, isRef, watch, onBeforeUnmount, onMounted, resolveComponent } from 'vue'

import { measureStringWidth } from '@/utils'

/**
 * 支持ant table拖拽改变列宽
 * @param {Array | Ref} columns ant columns配置
 * @param {Object} options 可配置参数
 *        padding {Number} td左右padding和 默认32
 *        style 计算text长度是 字体样式
 *        resetWidth {Boolean} 当column设置的width的总和小于table实际宽度 是否需要重置width 默认 true
 *        如果设置成false 不支持tooltip提示功能
 *        defaultMinWidth {Number} 当width和minWidth都没有配置时，默认将minWidth配置成defaultMinWidth(前提：resetWidth为true)
 * @return { Object }
 *        columns {ref<Array>}返回的table columns 配置>
 *        tableRef {ref<vNode>}返回的ref值，会自动和table ref关联
 *        components {Object}返回的table components 配置
 *        components {Object}返回的table components 配置
 *        run {Function}对外暴露的重新渲染函数
 *
*/

type Options = Partial<{
  defaultMinWidth: number,
  resetWidth: boolean,
  padding: number
  style?: any
}>

type ColumnPropsDefine = {
  minWidth?: number | undefined
  orgWidth?: number | undefined
  key?: number | string
  disabled?: boolean
  children?: Array<ColumnPropsDefine>
} & ColumnProps

export default function useTableColumnDrag (columns: Ref<ColumnPropsDefine[]> | ColumnPropsDefine[], options?: Options) {
  const { padding = 32, resetWidth = true, defaultMinWidth = 100, style = {} } = options || {}
  const dragingMap: Ref = ref({}) // 记录每列th是否拖拽
  const hoverMap: Ref = ref({}) // 记录每列th是否有hover
  const columnUpdated = ref(false) // 记录传过来的column是否被初始化过
  const updatedColumns: Ref<ColumnPropsDefine[]> = ref([]) // 保存columns初始化后的数据
  const tableRef: Ref = ref(null) // table ref
  /* 记录当前改变的th */
  let target
  /* 元素大小及其相对于视口的位置的信息 */
  let rectLeft: number
  /* 添加的一条线 */
  let line: HTMLDivElement
  let tableRectLeft: number

  /* 递归遍历 兼容表头嵌套问题 */
  const initDataRecursion = (data: Array<ColumnProps>) => {
    return data.map((item: ColumnPropsDefine) => {
      /* 如果没有设置width 和 minWidth 则设置成默认值 */
      if (!item.children?.length && item.width === undefined && item.minWidth === undefined) {
        item.width = item.minWidth = defaultMinWidth
      } else if (item.width === undefined) {
        /* 如果只minWidth 则将width设置成width || 默认值 */
        item.width = item.minWidth || defaultMinWidth
      }
      if (item.children?.length) {
        item.children = initDataRecursion(item.children)
      }
      return { ...item } // columns拷贝 目前只会改动width、minWidth 和 customRender 不需要完全深拷贝
    })
  }

  const initData = () => {
    updatedColumns.value = initDataRecursion(_columns.value)
  }

  /* 提供对外接口 刷新用 */
  const reload = () => {
    /* 重新初始化数据 */
    initData()

    /* updatedColumns重新赋值 */
    columnUpdated.value = false
    initColumnData()
  }

  /**
   * 递归获取vNode text
   * @param {vNode} vNode
   * @return {String}
   * */
  const getNodeText = (vNode: any) => {
    let text = ''
    if (!vNode) return text
    if (typeof vNode === 'string') {
      text = vNode
    } else if (typeof vNode.children === 'string') {
      text += vNode.children || ''
    } else {
      (vNode.children || []).forEach((node: any) => {
        text += getNodeText(node)
      })
    }

    return text
  }
  /**
   * 给td子元素包裹一层 a-tooltip
   * @param {Function | undefined} child columns设置的customRender
   **/
  const customRender = function(child: any) {
    return function({ text, index, record, column: col }: {text: string, record: any, index: number, column: ColumnProps}) {
      if (!col) return
      let childNode = null
      /* 如果存在则递归获取文本 */
      if (child) {
        // eslint-disable-next-line no-useless-call
        childNode = child.call(null, { text, record, index, col })
        text = getNodeText(childNode)
      }
      /* 判断字符是否超长 */
      const isOverflow = typeof text === 'string' ? measureStringWidth(text, style) > +(col.width || 0) - padding : false
      return isOverflow ? h(resolveComponent('a-tooltip'), {
        placement: 'top',
        title: typeof text === 'string' ? text : ''
      },
      [
        h('div',
          {
            class: 'ant-table-row-cell-resize-ellipsis'
          },
          [
            childNode || h('span', {}, text)
          ]
        )
      ]
      ) : (childNode || h('span', {}, text))
    }
  }

  const initColumnDataRecursion = (data: Array<ColumnProps>) => {
    data.forEach((item: ColumnPropsDefine) => {
      if (!item.slots && !item.children?.length) {
        item.customRender = customRender(item.customRender)
      }
      if (item.children?.length) {
        initColumnDataRecursion(item.children)
      }
    })
  }

  const initColumnData = () => {
    /* resetWidth为false 或者 column被重置过 */
    if (!resetWidth || columnUpdated.value) return
    /* 给columns每个数据 添加一个customRender 来实现tooltip */
    initColumnDataRecursion(updatedColumns.value)
    columnUpdated.value = true
    resetTableColumnWidth()
  }

  /* 获取表头 所有叶子节点 */
  const getLeafNode = (data: Array<ColumnPropsDefine>, list: Array<ColumnPropsDefine> = []) => {
    data.forEach(item => {
      if (!item.children?.length) {
        list.push(item)
      } else {
        getLeafNode(item.children, list)
      }
    })
    return list
  }
  /* 重置table宽度 来解决 拖拽使其他列宽度变动问题 */
  const resetTableColumnWidth = () => {
    /* 判断table是否已加载 */
    if (!tableRef.value || !tableRef.value.$el) {
      return
    }
    const leafNodeList = getLeafNode(updatedColumns.value)

    let selectionWidth = 0
    if (tableRef.value?.rowSelection?.columnWidth) {
      selectionWidth = tableRef.value.rowSelection.columnWidth
    }
    /* 获取table宽度 */
    const tableWidth = tableRef.value.$el.clientWidth - selectionWidth
    /* columns minWidth之和 */
    let totalMinWidth = 0
    /* columns width之和 */
    let totalColumnWidth = 0
    leafNodeList.forEach((element: ColumnPropsDefine) => {
      // eslint-disable-next-line prefer-const
      let minWidth: any = element.minWidth
      const width: any = element.width
      /* 如果没有设置width或者minWidth 则设置minWidth为默认的defaultMinWidth */
      if (width === undefined && minWidth === undefined) {
        element.minWidth = minWidth = defaultMinWidth
      }
      if (minWidth) {
        totalMinWidth += minWidth
      }
      totalColumnWidth += minWidth || width || 0
    })
    /* columns width之和 大于等于 table实际宽度 */
    if (totalColumnWidth >= tableWidth) {
      leafNodeList.forEach((item: ColumnPropsDefine) => {
        if (item.minWidth) {
          item.width = item.minWidth
          item.minWidth = undefined
        }
      })
    } else {
      /* columns width之和 小于 table实际宽度  */
      const dValue = tableWidth - totalColumnWidth // 总差值
      let addWidthTotal = 0 // 已分配的差值

      leafNodeList.forEach((item: ColumnPropsDefine) => {
        let addWidth = 0
        /* 如果没设置minWidth 则将差值按照width比例 进行分配 */
        if (totalMinWidth === 0) {
          addWidth = Math.ceil((+(item.width || 0) / totalColumnWidth) * dValue)
          addWidthTotal += addWidth
          if (addWidthTotal > dValue) {
            addWidth -= addWidthTotal - dValue
          }
          item.width = +(item.width || 0) + addWidth
        } else {
          /* 将差值按minWidth比例进行分配 */
          if (item.minWidth) {
            addWidth = Math.ceil((item.minWidth / totalMinWidth) * dValue)
            addWidthTotal += addWidth

            if (addWidthTotal > dValue) {
              addWidth -= addWidthTotal - dValue
            }
            item.width = item.minWidth + addWidth
            item.minWidth = undefined
          }
        }
      })
    }
  }

  const createLineEle = () => {
    const divEle = document.createElement('div')
    divEle.className = 'column-resize-line'
    tableRef.value.$el.querySelector('.ant-table').appendChild(divEle)
    return divEle
  }

  const findColByKey = (key: any, tableData: Array<ColumnProps>, column?: any) => {
    try {
      tableData.forEach((col: ColumnPropsDefine) => {
        const k = col.key || col.dataIndex
        if (k === key) {
          column = col
          /* 找到跳出循环 */
          throw new Error('找到了')
        } else if (col.children?.length) {
          column = findColByKey(key, col.children, column)
        }
      })
    } catch (e) {}

    return column
  }

  /* 重置table thead th 用来支持拖拽 */
  const resizeableTitle = computed(() => {
    return (props: any, children: any) => {
      const { key } = props
      const col: ColumnPropsDefine = findColByKey(key, updatedColumns.value)
      if (!col) return

      /* 记录原始宽度 */
      if (!col.orgWidth) col.orgWidth = +(col.width || 0)
      /* 如果没有宽度 或者 选择列 列支持fixed 则不支持拖拽 */
      if (col.children?.length || col.disabled || !col.width || key === 'selection-column') {
        return h(
          'th',
          {
            ...props
          },
          [children]
        )
      }

      const onDrag = () => {
        const event: any = window.event
        event.stopPropagation()
        let left = event.pageX
        if (!dragingMap.value[key]) {
          target = event.target
          /* 找到th */
          let scrollLeft = 0
          while (target && target.tagName !== 'TH') {
            target = target.parentNode
          }
          if (!target) return

          rectLeft = target.getBoundingClientRect().left

          /* 计算滚动偏移 */
          let isStart = false
          while (target) {
            if (!isStart && target && target.className === 'ant-table-body') {
              isStart = true
            } else if (isStart) {
              scrollLeft += target.scrollLeft || 0
            }
            target = target.parentNode
          }
          tableRectLeft = tableRef.value.$el.getBoundingClientRect().left + scrollLeft

          !line && (line = createLineEle())
          dragingMap.value[key] = ' draging'
        }

        left = (left < (rectLeft + (col.orgWidth || 0)) ? rectLeft + (col.orgWidth || 0) : left) - tableRectLeft - 5
        line.style.left = `${left}px`
        line.style.display = 'block'
      }
      const onDragstop = ({ x }: {x:number}) => {
        const event: any = window.event
        event.stopPropagation()

        line && (line.style.display = 'none')
        dragingMap.value[key] = ''
        col.width = Math.max(x, col.orgWidth || 0)
      }
      const dragEle = h(resolveComponent('vue3DraggableResizable'), {
        class: 'table-draggable-handle',
        onDragging: onDrag,
        'onDrag-end': onDragstop,
        draggable: true,
        w: 5,
        x: col.width,
        resizable: false,
        key: col.key,
        disabledY: true
      })

      return h(
        'th',
        {
          ...props,
          width: col.width,
          class: props.class + ' resize-table-th' + (col.width > col.orgWidth ? ' col-resize' : '') + (hoverMap.value[key] || '') + (dragingMap.value[key] || ''),
          onMouseover: () => {
            /* 记录当前hover的列 */
            /* 如果在拖拽 则不允许其他th添加active */
            if (!Object.values(dragingMap.value).some(v => v)) { hoverMap.value[key] = ' active' }
          },
          onMouseleave: () => {
            hoverMap.value[key] = ''
          }
        },
        [
          children,
          /* 默认的 vue-draggable-resizable 配置 */
          dragEle
        ]
      )
    }
  })

  /* column参数兼容 */
  const _columns = computed(() => {
    if (isRef(columns)) {
      return columns.value || []
    }
    return columns || []
  })

  /* 提供给ant table components的 */
  const components = computed(() => ({
    header: {
      cell: resizeableTitle.value
    }
  }))

  /* 数据变化 重新初始化 */
  watch(() => _columns.value, reload)

  /* 确保table 加载完成执行 */
  onMounted(() => {
    /* 只有需要调整列宽才调用 */
    resetWidth && initColumnData()
    /* 监听窗口变化 */
    window.addEventListener('resize', reload)
  })

  /* 销毁前 取消监听 */
  onBeforeUnmount(() => {
    window.removeEventListener('resize', reload)
  })

  /* 处理数据 */
  initData()

  return {
    components,
    columns: updatedColumns,
    tableRef,
    reload // 对外暴露 手动执行重新渲染
  }
}
