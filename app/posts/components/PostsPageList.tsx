import { StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardPost } from "app/posts/components/StackCardPost"
import getPostsInfinite from "app/posts/queries/getPostsInfinite"
import { useInfiniteQuery, useSession } from "blitz"
import React, { FunctionComponent } from "react"

export const PostsPageList: FunctionComponent = () => {
  const session = useSession()

  const [groupedPosts] = useInfiniteQuery(
    getPostsInfinite,
    (page = { skip: 0 }) => page,
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 4,
    }
  )

  return (
    <StackList divider={<StackDivider />}>
      {groupedPosts.map((group) => {
        return group.posts.map((post) => {
          return (
            <StackCardPost
              key={post.id}
              isDisabled={!session.userId || session.userId === post.user.id}
              {...post}
            />
          )
        })
      })}
    </StackList>
  )
}
