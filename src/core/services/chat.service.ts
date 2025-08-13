import { AxiosResponse } from 'axios'
import { ChatMessageDto } from '../dto/chat/chat.dto'
import axiosInstance from '../axios'

export const chatService = {
  getMessages: async (beforeTimeStamp: Date): Promise<AxiosResponse<ChatMessageDto[]>> =>
    await axiosInstance.get<ChatMessageDto[]>('/chat/global/messages', {
      params: {
        beforeTimeStamp,
      },
    }),
}
