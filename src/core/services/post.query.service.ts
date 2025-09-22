import { AxiosResponse } from 'axios'
import { CountNewPostsQuery, RecentPostsQuery } from '../dto/post/post.query'
import { PostDto } from '../dto/post/post.dto'
import axiosInstance from '../axios'

export const postQueryService = {
  getRecentPosts: async (params: RecentPostsQuery): Promise<AxiosResponse<PostDto[]>> =>
    await axiosInstance.get<PostDto[]>('/post/query/recent', {
      params,
    }),
  getPost: async (postId: string): Promise<AxiosResponse<PostDto>> =>
    await axiosInstance.get<PostDto>(`/post/query/${postId}`),
  countNewPosts: async (params: CountNewPostsQuery): Promise<AxiosResponse<number>> =>
    await axiosInstance.get<number>('/post/query/new/count', {
      params,
    }),
}
