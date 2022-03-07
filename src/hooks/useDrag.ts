/**
 * 使元素可以被拖动的hooks
 * @param {number} initLeft 初始left值
 * @param {number} initTop 初始top值
 * @param {string} syncName 如果有syncName，会以 ${syncName}.left, ${syncName}.top 作为键名，同步 left，top 的值到localStorage
 */
import type { CSSProperties } from 'vue'
import { reactive, toRefs } from 'vue'
export const useDrag = (initLeft = 0, initTop = 0, syncName = '') => {
  let left = initLeft
  let top = initTop
  const leftLocal = localStorage.getItem(`${syncName}.left`)
  const topLocal = localStorage.getItem(`${syncName}.top`)

  if (syncName && typeof leftLocal !== 'object') {
    left = parseInt(leftLocal)
  }
  if (syncName && typeof topLocal !== 'object') {
    top = parseInt(topLocal)
  }

  const styleState = reactive<{
    style: CSSProperties
  }>({
    style: {
      position: 'fixed',
      left: left + 'px',
      top: top + 'px',
      cursor: 'move',
      zIndex: 9999
    }
  })

  let mousedownLeft = 0
  let mousedownTop = 0
  let mousedownClientX = 0
  let mousedownClientY = 0
  const mousedown = (evt: MouseEvent) => {
    if (evt.button !== 0) {
      // 不是鼠标左键不处理
      return
    }
    if (
      styleState.style.left !== undefined &&
      typeof styleState.style.left !== 'number'
    ) {
      mousedownLeft = parseInt(styleState.style.left)
    }

    if (
      styleState.style.top !== undefined &&
      typeof styleState.style.top !== 'number'
    ) {
      mousedownTop = parseInt(styleState.style.top)
    }

    mousedownClientX = evt.clientX
    mousedownClientY = evt.clientY
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
  }
  const mousemove = (evt: MouseEvent) => {
    // 鼠标移动的距离
    const distanceX = evt.clientX - mousedownClientX
    const distanceY = evt.clientY - mousedownClientY

    styleState.style.left = mousedownLeft + distanceX + 'px'
    styleState.style.top = mousedownTop + distanceY + 'px'
  }

  const mouseup = () => {
    if (syncName) {
      if (
        styleState.style.left !== undefined &&
        typeof styleState.style.left !== 'number'
      ) {
        localStorage.setItem(
          `${syncName}.left`,
          parseInt(styleState.style.left).toString()
        )
      }

      if (
        styleState.style.top !== undefined &&
        typeof styleState.style.top !== 'number'
      ) {
        localStorage.setItem(
          `${syncName}.top`,
          parseInt(styleState.style.top).toString()
        )
      }
    }
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
  }

  return {
    ...toRefs(styleState),
    mousedown
  }
}
