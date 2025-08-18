import { AxiosResponse } from 'axios'
import { MessageDto } from '../dto/chat/chat.dto'
import axiosInstance from '../axios'

export const chatService = {
  getMessages: async (page: number): Promise<AxiosResponse<MessageDto[]>> =>
    await axiosInstance.get('/chat/global/messages', {
      params: {
        page,
      },
    }),
  getPostComments: async ({ postId, page }: { postId: string; page: number }): Promise<AxiosResponse<MessageDto[]>> =>
    await axiosInstance.get(`/chat/post/${postId}/comments`, {
      params: {
        page,
      },
    }),
}
