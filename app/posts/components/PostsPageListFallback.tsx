import { StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardPostSkeleton } from "app/posts/components/StackCardPostSkeleton"
import React, { VFC } from "react"

export const PostsPageListFallback: VFC = () => {
  const skeletons = Array(8)
    .fill(null)
    .map((_, i) => i)

  return (
    <StackList divider={<StackDivider />}>
      {skeletons.map((key) => (
        <StackCardPostSkeleton key={key} />
      ))}
    </StackList>
  )
}
