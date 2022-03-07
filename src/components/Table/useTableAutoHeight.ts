/**
 * 动态计算table tbody高度，响应式滚动条
 * @param {String} tableWrapperSelectorName Table父节点选择器名
 */
const useTableAutoHeight = (
  tableWrapperSelectorName: string,
  showPagination: boolean
) => {
  if (
    typeof tableWrapperSelectorName !== 'string' ||
    tableWrapperSelectorName === ''
  ) {
    throw TypeError(
      `tableWrapperSelectorName '${tableWrapperSelectorName}' is not valid css selector`
    )
  }

  /**
   * 获取兄弟节点
   * @param {*} tag
   */
  const _findSibling = (tag: HTMLElement) => {
    const parentEl = tag.parentNode
    if (parentEl !== null) {
      const childs = parentEl.children
      const siblings = []
      for (let i = 0; i <= childs.length - 1; i++) {
        if (childs[i] === tag) {
          continue
        }
        siblings[siblings.length] = childs[i]
      }
      return siblings
    }
    return []
  }

  /**
   * 获取margin给元素产生的额外高度
   * @param {*} ele
   */
  const _getExtraH = (ele: Element) => {
    const style = getComputedStyle(ele)
    const { marginTop, marginBottom } = style
    const marginTopH = parseInt(marginTop.replace('px', ''))
    const marginBottomH = parseInt(marginBottom.replace('px', ''))
    return marginTopH + marginBottomH
  }

  const _getAcitveHeight = (tableWrapper: HTMLElement) => {
    const tableWrapperExtraHeight = _getExtraH(tableWrapper)
    const brotherNodes = _findSibling(tableWrapper)
    const height = brotherNodes.reduce((acc, ele) => {
      const h = ele.clientHeight
      const extraH = _getExtraH(ele)
      return acc + h + extraH
    }, 0)
    return height + tableWrapperExtraHeight
  }

  const getTableWrapperHeight = () => {
    const tableWrapper: HTMLElement | null = document.querySelector(
      tableWrapperSelectorName
    )
    if (tableWrapper !== null) {
      const activeHeight = _getAcitveHeight(tableWrapper)
      tableWrapper.style.height = `calc(100% - ${activeHeight}px)`
      // 计算后得出容器高度
      const wrapperHeight = getComputedStyle(tableWrapper).height
      const tableHeaderHeight = 55
      const tablePaginationHeight = showPagination ? 64 : 0
      return (
        Number(wrapperHeight.replace('px', '')) -
        tableHeaderHeight -
        tablePaginationHeight
      )
    }
    console.warn(
      `tableWrapperSelectorName '${tableWrapperSelectorName}' is not valid css selector`
    )
  }

  return { getTableWrapperHeight }
}

export default useTableAutoHeight
