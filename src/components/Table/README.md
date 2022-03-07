## 欢迎使用 s-table 组件！

> 开发者：黄健东<huangjd@yuanfudao.com>

S-Table
拓展了拖拽和滚动区域自适应功能
todo:useTableAutoHeight在margin重叠情况下计算有误差，布局请避免margin重叠

```html
<s-table
  :draggable="true"
  @drag-change="onDragChange"
  ref="table"
>
  <!-- [!warning]属性draggable 与 rowKey互斥，请勿同时使用，否则会造成排序显示异常 -->
</s-table>
```
```ts
type XXXId = number

interface RecordType {
  id: RankId
  code: number
  // ...
}

/**
 * 拖拽事件
 * @param RecordType 传入列表元数据结构
 */
interface DragEventObject<RecordType> {
  moved: {
    newIndex: number
    oldIndex: number
    element: RecordType
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const _reSort = async (id: XXXId, newOrder: number) => {
  await reSortXXX({ id, newOrder })
}

const onDragChange = async (event: DragEventObject<RecordType>) => {
  const {
    element: { id },
    newIndex,
  } = event.moved

  await _reSort(id, newIndex + 1)

}
```