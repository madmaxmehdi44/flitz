import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  StackDivider,
} from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { BoxCardExchange } from "app/exchanges/components/BoxCardExchange"
import getExchanges from "app/exchanges/queries/getExchanges"
import { usePaginatedQuery, useRouter } from "blitz"
import React, { VFC } from "react"
import { useTranslation } from "react-i18next"

const ITEMS_PER_PAGE = 20

export const BoxExchangeList: VFC = () => {
  const { t } = useTranslation()

  const router = useRouter()

  const page = Number(router.query.page) || 0

  const [{ items: messageThreads, hasMore, count }] = usePaginatedQuery(
    getExchanges,
    { skip: ITEMS_PER_PAGE * page }
  )

  const onPreviousPage = () => {
    router.push({ query: { page: page - 1 } })
  }

  const onNextPage = () => {
    router.push({ query: { page: page + 1 } })
  }

  const onMoveExchangePage = (
    messageThreadId: string,
    relatedUserId: string | null
  ) => {
    if (relatedUserId === null) {
      router.push(`/exchanges/${messageThreadId}`)
      return
    }

    router.push(`/exchanges/-/${relatedUserId}`)
  }

  return (
    <StackList divider={<StackDivider />}>
      {count === 0 && (
        <Box px={4}>
          <Alert status={"info"}>
            <AlertIcon />
            {t("No Exchanges")}
          </Alert>
        </Box>
      )}
      {messageThreads.map((messageThread) => (
        <BoxCardExchange
          {...messageThread}
          key={messageThread.id}
          onClick={() => {
            onMoveExchangePage(messageThread.id, messageThread.relatedUser.id)
          }}
        />
      ))}
      <HStack spacing={4}>
        <Button isDisabled={count === 0 || page === 0} onClick={onPreviousPage}>
          {"Previuos"}
        </Button>
        <Button isDisabled={!hasMore} onClick={onNextPage}>
          {"Next"}
        </Button>
      </HStack>
    </StackList>
  )
}
