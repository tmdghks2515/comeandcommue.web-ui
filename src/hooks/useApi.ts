import { AxiosError, AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import useSnackbar from '@/hooks/useSnackbar'
import useGlobalLoading from '@/store/useGloabalLoading'

type UseApiProps<T, D> = {
  api: (params: T) => Promise<AxiosResponse<D>>
  onSuccess?: (data: D, params: T) => void
  onError?: (error: AxiosError) => void
  onComplete?: (params: T) => void
  immediate?: boolean
  initalParams?: T
  globalLoading?: boolean
}

export default function useApi<T, D>({
  api,
  onSuccess,
  onError,
  onComplete,
  immediate,
  initalParams,
  globalLoading,
}: UseApiProps<T, D>) {
  const [loading, setIsLoading] = useState(false)
  const [data, setData] = useState<D>()
  const [completed, setCompleted] = useState(false)

  const { showSnackbar } = useSnackbar()
  const setGloabalLoading = useGlobalLoading((state) => state.setLoading)

  const execute = async (params?: T) => {
    if (loading) return
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
          showSnackbar({
            message: error?.response?.data?.message,
            variant: 'danger',
          })
        return error
      })
      .finally(() => {
        onComplete?.(params as T)
        setIsLoading(false)
        globalLoading && setGloabalLoading(false)
        setCompleted(true)
      })
  }

  useEffect(() => {
    immediate && execute(initalParams)
  }, [immediate])

  return {
    execute,
    loading,
    data,
    setData,
    completed,
  }
}
