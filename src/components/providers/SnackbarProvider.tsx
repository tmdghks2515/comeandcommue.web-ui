'use client'

import Snackbar from '@mui/joy/Snackbar'
import Stack from '@mui/joy/Stack'
import useSnackbarStore from '@/store/useSnackbarStore'
import { useMemo } from 'react'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import ErrorOutline from '@mui/icons-material/ErrorOutline'

export default function SnackbarProvider() {
  const { open, message, variant, title } = useSnackbarStore((state) => state.snackbarProps)

  const handleClose = () => {
    useSnackbarStore.setState({ snackbarProps: { open: false, message: '', variant: undefined } })
  }

  const startDeco = useMemo(() => {
    switch (variant) {
      case 'success':
        return <CheckCircleOutline />
      case 'danger':
        return <ErrorOutline />
      case 'warning':
        return <ErrorOutline />
      default:
        return undefined
    }
  }, [variant])

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={3000}
      variant="soft"
      color={variant}
      size="sm"
      startDecorator={startDeco}
    >
      <Stack spacing={1}>
        {title && <span className="text-lg font-bold">{title}</span>}
        {message}
      </Stack>
    </Snackbar>
  )
}
