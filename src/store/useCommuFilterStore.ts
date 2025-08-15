import { communityValueLabels } from '@/constants/post.constants'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CommuFilterStore = {
  selected: string[]
  setSelected: (selected: string[]) => void
  selectAll: () => void
  clearSelection: () => void
}

const useCommuFilterStore = create<CommuFilterStore>()(
  persist(
    (set) => ({
      selected: communityValueLabels.map((item) => item.value),
      setSelected: (values) => set({ selected: values }),
      selectAll: () => set({ selected: communityValueLabels.map((item) => item.value) }),
      clearSelection: () => set({ selected: [] }),
    }),
    {
      name: 'commuFilter',
    },
  ),
)

export default useCommuFilterStore
