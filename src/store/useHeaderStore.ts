import { create } from 'zustand'

type HeaderStore = {
  headerTitle?: string
  setHeaderTitle: (headerTitle: string) => void
}

const headerStore = create<HeaderStore>((set) => ({
  headerTitle: undefined,
  setHeaderTitle: (headerTitle: string) => set({ headerTitle }),
}))

export default headerStore
