import { create } from 'zustand'
import { DefaultColorPalette } from '@mui/joy/styles/types/colorSystem'

type SnackbarProps = {
  open: boolean
  title?: string
  message: string
  variant?: DefaultColorPalette
}

type SnackbarStore = {
  snackbarProps: SnackbarProps
  showSnackbar: (props: Omit<SnackbarProps, 'open'>) => void
}

const useSnackbarStore = create<SnackbarStore>((set) => ({
  snackbarProps: {
    open: false,
    message: '',
  },
  showSnackbar: (props) =>
    set(() => ({
      snackbarProps: {
        open: true,
        ...props,
      },
    })),
}))

export default useSnackbarStore
