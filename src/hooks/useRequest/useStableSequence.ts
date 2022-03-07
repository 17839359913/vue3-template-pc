import { ref, Ref } from 'vue'

type Service<T> = (...args: any[]) => Promise<T>

export function useStableSequence<T = any>(service: Service<T>) {
  const data: Ref<T | undefined> = ref(undefined)
  const error: Ref<Error | null> = ref(null)
  let lastRequestId = 0 // 请求id

  const run = async (...args: any[]) => {
    lastRequestId++
    const runId = lastRequestId // 本次请求的id
    try {
      const result = await service(...args)
      if (runId === lastRequestId) {
        data.value = result
        error.value = null
      }
    } catch (err) {
      if (runId === lastRequestId) {
        error.value = err as any
        data.value = undefined
      }
    }
  }

  return {
    run,
    data,
    error
  }
}
