import { HStack, Link as LinkText, Stack, Text } from "@chakra-ui/react"
import { Link } from "blitz"
import { AppUserProfile } from "integrations/interface/types/appUserProfile"
import React, { VFC } from "react"

type Props = AppUserProfile

export const BoxUserFriendship: VFC<Props> = (props) => {
  return (
    <Stack spacing={2} px={4}>
      <Stack>
        <Text fontWeight={"bold"}>{props.biography}</Text>
      </Stack>
      <HStack align={"center"} spacing={2}>
        <Text color={"gray.500"} fontSize={"sm"}>
          {"CreatedAt"}
        </Text>
        <Text color={"gray.500"} fontSize={"sm"}>
          {props.createdAt.toDateString()}
        </Text>
      </HStack>
      <HStack align={"center"} spacing={4}>
        <Link href={`/${props.username}/followees`} passHref>
          <LinkText color={"gray.500"} fontWeight={"bold"}>
            {`${props.followeesCount} Following`}
          </LinkText>
        </Link>
        <Link href={`/${props.username}/followers`} passHref>
          <LinkText color={"gray.500"} fontWeight={"bold"}>
            {`${props.followersCount} Followers`}
          </LinkText>
        </Link>
      </HStack>
    </Stack>
  )
}
