/**
 * 函数防抖，返回有防抖功能的新函数。
 * 新函数的返回值是一个Promise，resolve原函数的返回值
 * @param fn 要执行的函数
 * @param timeout 防抖时间，单位ms
 */
 export function debounce<T> (fn: (...args: any[]) => T, timeout = 500) {
    let timer: ReturnType<typeof setTimeout>
  
    return function (this: any, ...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
  
      timer && clearTimeout(timer)
  
      return new Promise<T>(resolve => {
        timer = setTimeout(() => {
          resolve(fn.call(_this, ...args))
        }, timeout)
      })
    }
  }
  