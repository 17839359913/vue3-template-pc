/**
 * 测量字符串在特定样式下渲染后等宽度
 * @param {string} str 要测量等字符串
 * @param {object} style 样式对象
 */
export function measureStringWidth(str: string, style = {}): number {
  const ele: HTMLElement = document.createElement('span')
  ele.innerText = str
  const s = {
    ...style,
    position: 'absolute',
    visibility: 'hidden',
    zIndex: '-1000'
  }

  Object.entries(s).forEach((kv: any[]) => {
    ele.style[kv[0]] = kv[1]
  })
  document.body.appendChild(ele)
  const width = ele.offsetWidth
  document.body.removeChild(ele)
  return width
}
