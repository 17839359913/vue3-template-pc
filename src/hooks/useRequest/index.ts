import { watch, Ref, ref, computed, ComputedRef } from 'vue-demi'
import { useLoadingDelay } from './useLoadingDelay'
import { usePagination } from './usePagination'
import { useStableSequence } from './useStableSequence'
import { debounce } from './debounce'

type Service<T> = (...args: any[]) => Promise<T>
export type Options = Partial<{
  /**
   * @deprecated 请不要再使用 initialData 了，推荐使用 vue computed 处理 data
   */
  initialData: any;
  loadingDelay: number;
  manual: boolean;
  debounceInterval: number;
  /**
   * @deprecated 请不要再使用 refreshDeps 了， todo 这里将会重构
   */
  refreshDeps: Ref<any>[];
  paginated: boolean;
  defaultCurrent: number;
  defaultPageSize: number;
}>
type OptionsWithFormat<T, S> = {
  /**
   * @deprecated 请不要再使用 formatResult 了，推荐使用 vue computed 处理 data
   * formatResult 只在每次响应回来时候，对原始响应调用。mutate 直接设置的值，就不会经过 formatResult 的处理
   */
  formatResult: (result: T) => S;
} & Options

export type ResultType<T> = {
  loading: ComputedRef<boolean>;
  error: ComputedRef<Error | null>;
  data: ComputedRef<T>;

  run: () => void;
  refresh: () => void;
  mutate: (newDataOrFunction: any) => void;
  pagination: ReturnType<typeof usePagination>['pagination'];
}

/**
 * 发送请求的 vue hooks，移植自 React 版本的 ahooks useRequest，api 有改动
 * @param service 请求函数
 * @param options 配置选项
 */
export function useRequest<T = any>(service: Service<T>, options?: Options): ResultType<T>;
export function useRequest<T = any, S = any>(service: Service<T>, options: OptionsWithFormat<T, S>): ResultType<S>;
export function useRequest<T = any>(service: Service<T>, options: Options = {}): ResultType<T> {
  const { loading, setTrue: _setLoadingTrue, setFalse: _setLoadingFalse } = useLoadingDelay(options.loadingDelay)
  const { data: _stableData, error: _stableError, run: _stableRun } = useStableSequence((...args: any[]) => _sendRequest(...args))
  const _mutatedData = ref(null) // 保存突变的数据
  const data = computed(() => {
    const result = _mutatedData.value ?? _stableData.value ?? options.initialData
    return result
  })
  const error = computed(() => {
    return _stableError.value
  })

  const pagination: ResultType<T>['pagination'] | null =
    options.paginated
      ? usePagination(() => refresh(), {
        defaultCurrent: options.defaultCurrent,
        defaultPageSize: options.defaultPageSize
      }).pagination
      : null

  const _debouncedService: ((...args: any[]) => Promise<T>) | undefined =
    options.debounceInterval
      ? debounce(service, options.debounceInterval) as any as (...args: any[]) => Promise<T>
      : undefined

  const _sendRequest = async (pageInfo?: { current: number, pageSize: number }) => {
    try {
      _setLoadingTrue()

      const request = _debouncedService || service

      const result = pageInfo ? await request(pageInfo) : await request()
      const opt = options as any  // 为了处理参数里有 formatResult 的情况
      const val = opt.formatResult ? opt.formatResult(result) : result
      return val
    }
    finally {
      _setLoadingFalse()
    }
  }

  const run = () => {
    if (pagination) {
      pagination.current = 1  // run 相比 refresh，或重制页码到 1
      const { current, pageSize } = pagination
      _stableRun({ current, pageSize })
    } else {
      _stableRun()
    }
  }

  const refresh = () => {
    if (pagination) {
      const { current, pageSize } = pagination
      _stableRun({ current, pageSize })
    } else {
      _stableRun()
    }
  }

  const mutate = (newDataOrFunction: any): void => {
    if (typeof newDataOrFunction === 'function') {
      _mutatedData.value = newDataOrFunction(data.value)
    } else {
      _mutatedData.value = newDataOrFunction
    }
  }

  // 根据 data 获取 pagination 的 tatol
  watch(data, d => {
    if (d && pagination) {
      // 现在很多接口都返回大写开头的 Total 或小写的 count 表示总数量，兼容下
      pagination.total = d?.Total || d?.data?.Total || d?.data?.data?.Total ||
        d?.total || d?.data?.total || d?.data?.data?.total ||
        d?.count || d?.data?.count || d?.data?.data?.count ||
        0
    }
  })

  // 当重新回去到请求数据后，重置 mutatedData 为 null，让上次的突变失效
  watch(_stableData, () => {
    _mutatedData.value = null
  })

  if (!options.manual) {
    refresh()
  }

  if (Array.isArray(options.refreshDeps)) {
    watch(() => options.refreshDeps, run, { deep: true })
  }
  return {
    loading,
    data,
    error,
    run,
    refresh,
    mutate,
    pagination
  } as any
}
