import { AxiosResponse } from 'axios'
import axiosInstance from '../axios'
import { UserDto } from '../dto/user/user.dto'

export const userService = {
  createUser: async (): Promise<AxiosResponse<UserDto>> => await axiosInstance.post('/user'),
  getUser: async (): Promise<AxiosResponse<UserDto>> => await axiosInstance.get('/user'),
}
