import { useSession } from "@blitzjs/auth"
import { useParam } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import {
  Button,
  HStack,
  Icon,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { FC, useState } from "react"
import { FiImage, FiSend } from "react-icons/fi"
import { AvatarUser } from "interface/core/components/AvatarUser"
import createReply from "integrations/mutations/createReply"

export const BoxFormPost: FC = () => {
  const session = useSession()

  const postId = useParam("postId", "string")

  const [text, setText] = useState("")

  const [createReplyMutation, { isLoading }] = useMutation(createReply)

  const toast = useToast()

  const onCreatePost = async () => {
    if (!postId) return
    try {
      await createReplyMutation({ text, postId })
      toast({ status: "success", title: "Success" })
      setText("")
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  const isDisabled = text.trim().length === 0

  if (!session) {
    return null
  }

  return (
    <Stack spacing={4} px={4}>
      <HStack w={"full"} spacing={4} align={"flex-start"}>
        <AvatarUser userId={session.userId} />
        <Textarea
          isDisabled={isLoading}
          onChange={(event) => setText(event.target.value)}
          placeholder={"Here is a sample placeholder"}
          value={text}
          w={"full"}
        />
      </HStack>
      <HStack pl={14} spacing={4} justify={"flex-end"}>
        <Button
          aria-label={"Image"}
          isDisabled={isLoading}
          leftIcon={<Icon as={FiImage} fontSize={"xl"} />}
          variant={"outline"}
        >
          {"Image"}
        </Button>
        <Button
          aria-label={"Submit"}
          isDisabled={isDisabled}
          isLoading={isLoading}
          leftIcon={<Icon as={FiSend} />}
          loadingText={"Post"}
          onClick={() => onCreatePost()}
          variant={"outline"}
        >
          {"Post"}
        </Button>
      </HStack>
    </Stack>
  )
}
