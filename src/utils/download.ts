/**
 * 下载资源
 * @param url 资源链接
 */
export default function downloadFileFromUrl(url: string) {
  const link = document.createElement('a')
  link.href = typeof url === 'string' ? url : 'javascript:;'
  link.type = 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
