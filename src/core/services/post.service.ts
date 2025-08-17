import { AxiosResponse } from 'axios'
import { RecentPostsQuery } from '../dto/post/post.query'
import { PostDto } from '../dto/post/post.dto'
import axiosInstance from '../axios'

export const postService = {
  hitPost: async (postId: string): Promise<AxiosResponse<void>> =>
    await axiosInstance.post(`/post/interaction/${postId}/hit`),
  likePost: async (postId: string): Promise<AxiosResponse<boolean>> =>
    await axiosInstance.post(`/post/interaction/${postId}/like`),
}
