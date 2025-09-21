import { AxiosResponse } from 'axios'
import { RecentPostsQuery } from '../dto/post/post.query'
import { PostDto } from '../dto/post/post.dto'
import axiosInstance from '../axios'

export const postQueryService = {
  getRecentPosts: async (params: RecentPostsQuery): Promise<AxiosResponse<PostDto[]>> =>
    await axiosInstance.get<PostDto[]>('/post/query/recent', {
      params,
    }),
  getPost: async (postId: string): Promise<AxiosResponse<PostDto>> =>
    await axiosInstance.get<PostDto>(`/post/query/${postId}`),
}
