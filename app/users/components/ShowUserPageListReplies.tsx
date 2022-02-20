import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardPost } from "app/posts/components/StackCardPost"
import getUserRepliesInfinite from "app/users/queries/getUserRepliesInfinite"
import { useInfiniteQuery, useParam } from "blitz"
import React, { VFC } from "react"
import { useTranslation } from "react-i18next"

export const ShowUserPageListReplies: VFC = () => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [pages, { isFetching }] = useInfiniteQuery(
    getUserRepliesInfinite,
    (page = { skip: 0, username }) => page,
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  const posts = pages.flatMap((page) => page.items)

  const isEmpty = !isFetching && posts.length === 0

  return (
    <StackList divider={<StackDivider />}>
      {isEmpty && (
        <Box key={"empty"} px={4}>
          <Alert key={"alert"} status={"info"}>
            <AlertIcon />
            {t("This user hasn't posted yet.")}
          </Alert>
        </Box>
      )}
      {posts.map((post) => {
        return <StackCardPost key={post.id} {...post} isDisabled={false} />
      })}
    </StackList>
  )
}
