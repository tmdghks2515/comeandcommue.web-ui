import { UserDto } from '@/core/dto/user/user.dto'
import { userService } from '@/core/services/user.service'
import useApi from '@/hooks/useApi'
import useLoginUserStore from '@/store/useLoginUserStore'

export default function LoginUserProvider() {
  const { setLoginUser } = useLoginUserStore()

  const { execute: executeCreateUser } = useApi<void, UserDto>({
    api: userService.createUser,
    onSuccess: (data) => {
      setLoginUser(data)
      window.location.reload()
    },
    onError: (err) => {
      alert('알 수 없는 오류가 발생했습니다.')
    },
  })

  useApi<void, UserDto>({
    api: userService.getUser,
    onSuccess: (data) => {
      setLoginUser(data)
    },
    onError: () => {
      executeCreateUser()
    },
    immediate: true,
  })

  return <></>
}
