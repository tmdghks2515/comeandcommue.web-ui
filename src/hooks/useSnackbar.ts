import useSnackbarStore from '@/store/useSnackbarStore'

const useSnackbar = () => {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar)

  return {
    showSnackbar,
  }
}

export default useSnackbar
