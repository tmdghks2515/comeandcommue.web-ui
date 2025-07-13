import useSnackbarStore from '@/store/useSnackbarStore'

const useSnackbar = () => {
  const openSnackbar = useSnackbarStore((state) => state.openSnackbar)

  return {
    openSnackbar,
  }
}

export default useSnackbar
