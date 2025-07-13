import { create } from 'zustand'

type GlobalLoading = {
  loading: boolean
  setLoading: (loading: boolean) => void
}

const useGlobalLoading = create<GlobalLoading>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}))

export default useGlobalLoading
