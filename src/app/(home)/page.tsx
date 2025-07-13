'use client'

import { communityLabelMap } from '@/constants/post.constants'
import { postQueryService } from '@/core/services/post.query.service'
import useApi from '@/hooks/useApi'
import { List, ListItem } from '@mui/joy'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Home() {
  const { data: posts } = useApi({
    api: postQueryService.getRecentPosts,
    executeImmediately: true,
    initalParams: {
      communityTypes: [],
      pageSize: 50,
    },
  })

  useEffect(() => {
    console.log(posts)
  }, [posts])

  return (
    <main>
      <List>
        {posts?.map((post) => (
          <ListItem key={post.id} className="flex items-center gap-2">
            {/* <Image
              src={post.thumbnailUrl || '/images/default-thumbnail.png'}
              alt={post.title}
              width={100}
              height={100}
            /> */}
            <span>{communityLabelMap[post.communityType]}</span>
            <h3>{post.title}</h3>
          </ListItem>
        ))}
      </List>
    </main>
  )
}
