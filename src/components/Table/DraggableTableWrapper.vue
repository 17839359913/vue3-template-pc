<template>
  <VueDraggableNext
    tag="tbody"
    v-bind="sortableOptions"
    :sort="dragging"
    :list="dataSource"
    @change="onDragChangeLocal"
  >
    <slot />
  </VueDraggableNext>
</template>
<script lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'
import { defineComponent, toRef, inject, ComputedRef, PropType } from 'vue'

/**
 * 拖拽事件
 * @param ListRecordType 传入列表元数据结构
 */
export interface DragEventObject<ListRecordType> {
  moved: {
    newIndex: number
    oldIndex: number
    element: ListRecordType
  }
  [key: string]: any
}

export default defineComponent({
  name: 'DraggableTableWrapper',
  components: { VueDraggableNext },
  props: {
    draggable: {
      type: Boolean,
      default: true
    },
    // eslint-disable-next-line vue/require-default-prop
    onDragChange: {
      type: Function as PropType<(e: DragEventObject<any>) => void>
    }
  },
  setup(props) {
    const dragging = toRef(props, 'draggable')
    const onDragChangeLocal = (e: DragEventObject<any>) => {
      if (props.onDragChange !== undefined) {
        props.onDragChange(e)
      }
    }
    const dataSource = inject('dataSource') as ComputedRef<unknown[]>
    const sortableOptions = {
      ghostClass: 'sortable-ghost',
      animation: 300,
      dragoverBubble: false
    }

    // [Warn] 该组件默认会emit一个change事件，在外层监听即可，例如：onChange

    return {
      dragging,
      sortableOptions,
      dataSource,
      onDragChangeLocal
    }
  }
})
</script>
