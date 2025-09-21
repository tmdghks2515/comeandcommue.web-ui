import { UserDto } from '@/core/dto/user/user.dto'
import { create } from 'zustand'

type LoginUser = {
  loginUser: UserDto
  setLoginUser: (loginUser: UserDto) => void
}

const useLoginUserStore = create<LoginUser>((set) => ({
  loginUser: {
    id: 'unknown',
    nickname: '',
    createdAt: new Date(),
  },
  setLoginUser: (loginUser: UserDto) => set({ loginUser }),
}))

export default useLoginUserStore
