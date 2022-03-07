import { reactive, watch } from 'vue'

type Callback = ((param: { current: number, pageSize: number }) => void) | null;

type Options<T extends Record<string, unknown>> = T & {
  defaultCurrent?: number;
  defaultPageSize?: number;
}

type Pagination = {
  total: number;
  current: number;
  pageSize: number;
  onChange: ((current: number, pageSize: number) => void) | null;
  onShowSizeChange: ((current: number, pageSize: number) => void) | null;
}

/**
 * 分页管理
 * @param callback 页数改变或每页大小改变后，要执行的回调
 * @param options
 * @returns
 */
export const usePagination = <T extends Record<string, unknown>>(callback: Callback, options?: Options<T>) => {
  const { defaultCurrent, defaultPageSize, ...rest } = options || {}
  const pagination = reactive<Pagination & Options<T>>({
    total: 0,
    current: defaultCurrent || 1,
    pageSize: defaultPageSize || 10,
    onChange: null,
    onShowSizeChange: null,
    // (defaultPageSize ? options : rest) 是为了当 defaultPageSize 为空时， pagination 中不出现 defaultPageSize。方式 antdv 的类型检查出错
    ...(((defaultPageSize ? options : rest) || {}) as Options<T>)
  })

  const onChange = (current: number, pageSize: number) => {
    pagination.current = current
    pagination.pageSize = pageSize
  }

  pagination.onChange = onChange
  pagination.onShowSizeChange = onChange

  watch([
    () => pagination.current,
    () => pagination.pageSize
  ], () => {
    const { current, pageSize } = pagination
    callback && callback({ current, pageSize })
  })

  return {
    pagination
  }
}
