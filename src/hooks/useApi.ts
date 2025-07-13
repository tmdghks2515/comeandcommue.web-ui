import { AxiosError, AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import useSnackbar from '@/hooks/useSnackbar'
import useGlobalLoading from '@/store/useGloabalLoading'

type UseApiProps<T, D> = {
  api: (params: T) => Promise<AxiosResponse<D>>
  onSuccess?: (data: D, params: T) => void
  onError?: (error: AxiosError) => void
  onComplete?: () => void
  executeImmediately?: boolean
  initalParams?: T
  globalLoading?: boolean
}

export default function useApi<T, D>({
  api,
  onSuccess,
  onError,
  onComplete,
  executeImmediately,
  initalParams,
  globalLoading,
}: UseApiProps<T, D>) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<D>()
  const [completed, setCompleted] = useState(false)

  const { openSnackbar } = useSnackbar()
  const setGloabalLoading = useGlobalLoading((state) => state.setLoading)

  const execute = async (params?: T) => {
    if (isLoading) return
    setIsLoading(true)
    globalLoading && setGloabalLoading(true)
    return api(params as T)
      .then((res) => {
        onSuccess?.(res.data, params as T)
        setData(res.data)
        return res.data
      })
      .catch((error) => {
        onError?.(error)
        error?.response?.data?.message &&
          openSnackbar({
            message: error?.response?.data?.message,
            variant: 'danger',
          })
        return error
      })
      .finally(() => {
        onComplete?.()
        setIsLoading(false)
        globalLoading && setGloabalLoading(false)
        setCompleted(true)
      })
  }

  useEffect(() => {
    executeImmediately && execute(initalParams)
  }, [executeImmediately])

  return {
    execute,
    isLoading,
    data,
    completed,
  }
}
