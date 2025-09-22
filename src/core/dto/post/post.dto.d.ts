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
  postedAt: Date
  createdAt: Date
}

export type { PostDto }
