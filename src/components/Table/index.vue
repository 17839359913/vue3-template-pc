<script lang="tsx">
import {
  defineComponent,
  provide,
  ref,
  // toRef,
  toRefs,
  computed
} from 'vue'

import T from 'ant-design-vue/es/table/Table'
import DraggableTableWrapper, { DragEventObject } from './DraggableTableWrapper.vue'
// import useTableColumnDrag from './useTableColumnDrag'
import useTableScrollTopRecord from './useTableScrollTopRecord'
import useTableResizeObserve from './useTableResizeObserve'
export default defineComponent({
  name: 'STable',
  components: { DraggableTableWrapper },
  props: Object.assign({}, T.props, {
    /*
     * table-wrapper行内样式
     */
    bodyStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    /*
     * 自适应高度
     */
    heightSelfAdaption: {
      type: Boolean,
      default: true
    },
    /**
     * 是否可对行进行拖拽排序
     */
    draggable: {
      type: Boolean,
      default: false
    },
    columnDrag: {
      type: Boolean,
      default: false
    },
    scrollTop: {
      type: Number
    }
  }),
  setup(props, context) {
    const wrapperClass = ref(`table-wrapper-${Math.ceil(Math.random() * 1000)}`)

    /* 记录和初始化table的scrollTop */
    const { scrollTop, dataSource, pagination, heightSelfAdaption } = toRefs(props)
    useTableScrollTopRecord(scrollTop, `.${wrapperClass.value}`, dataSource, context.emit)

    /* 响应式scrollY计算 */
    const { scrollY } = useTableResizeObserve(`.${wrapperClass.value}`, pagination, heightSelfAdaption)

    // 供拖拽子组件获取dataSource
    provide(
      'dataSource',
      computed(() => props.dataSource)
    )

    // if (props.columnDrag) {
    //   const { columns, components, tableRef } = useTableColumnDrag(toRef(props, 'columns'))
    //   return { wrapperClass, scrollY, emit: context.emit, slots: context.slots, columns, components, tableRef }
    // }
    return { wrapperClass, scrollY, emit: context.emit, slots: context.slots }
  },
  mounted() {
    if (this.columnDrag) {
      // this.tableRef = this.$refs.tableRef
    }
  },
  render() {
    const props: typeof T.props = {}
    // 引入拖拽组件嵌套原有tbody
    if (this.draggable) {
      const onDragChange = (event: DragEventObject<any>) =>
        this.emit('drag-change', event)
      props.components = {
        body: {
          wrapper: (
            <DraggableTableWrapper
              draggable={this.draggable}
              onDragChange={onDragChange}
            />
          )
        }
      }
    }
    Object.keys(T.props).forEach(k => {
      this[k] !== undefined && (props[k] = this[k])
      return props[k]
    })
    // 设置y轴可滚动距离
    props.scroll = {
      x: '100%',
      y: this.scrollY,
      ...props.scroll
    }
    const wrapperStyle = {
      ...this.bodyStyle,
      position: 'relative'
    }
    const table = (
      <a-table ref="tableRef" {...props} columns={this.columns} components={this.components} v-slots={this.slots}>
        {Object.keys(this.slots).map(name => (
          <template slot={name}>{this.slots[name]}</template>
        ))}
      </a-table>
    )

    return (
      <div class={this.wrapperClass} style={wrapperStyle}>
        {table}
      </div>
    )
  }
})
</script>

<style lang="less">
/* table 列 可拖拽改变列宽 */
.ant-table {
  .resize-table-th {
    position: relative;
    user-select: none;
    .ant-table-header-column > div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .table-draggable-handle {
      height: 100% !important;
      bottom: 0;
      left: auto !important;
      right: 0px;
      cursor: e-resize;
      touch-action: none;
      position: absolute;
      top: 0px;
      z-index: 1;
      user-select: auto;
      width: 5px !important;
      transform: none !important;
      border: none;
    }

    &.col-resize {
      .table-draggable-handle {
        cursor: col-resize;
      }
    }

    /* hover效果 */
    &:not(.ant-table-selection-column) {
      &.active {
        background-color: #f4f4f4;
        .table-draggable-handle {
          background-color: #ccc;
          &:hover, &:active {
            background-color: #999;
          }
        }
      }
      &.draging {
        background-color: #f4f4f4;
        .table-draggable-handle {
          background-color: #999;
        }
      }
    }
  }

  .ant-table-row-cell-resize-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 强制修改下面的所有元素改为行内 */
    * {
      display: inline;
    }
  }

  .column-resize-line {
    width: 5px;
    background-color: #ccc;
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 9;
    transform: translate3d(0, 0, 0);
  }
}
</style>
