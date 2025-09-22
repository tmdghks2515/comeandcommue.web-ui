type RecentPostsQuery = {
  communityTypes: CommunityType[]
  pageSize: number
  createdAtFrom?: Date
  createdAtTo?: Date
}

type CountNewPostsQuery = {
  communityTypes: CommunityType[]
  createdAtTo: Date
}

export type { RecentPostsQuery, CountNewPostsQuery }
