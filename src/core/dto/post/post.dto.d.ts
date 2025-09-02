type PostDto = {
  id: string
  postNo: string
  title: string
  categoryName: string
  linkHref: string
  thumbnailSrc: string
  authorName: string
  hasImg: boolean
  likeCount: number
  hitCount: number
  commentCount: number
  communityType: CommunityType
  liked: boolean
  postedAt: string // ISO date string
  createdAt: string // ISO date string
}

export type { PostDto }
