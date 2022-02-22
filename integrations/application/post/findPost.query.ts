import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includePostEmbedded } from "integrations/infrastructure/utils/includePostEmbedded"
import { injectable } from "tsyringe"

type Props = {
  postId: Id
  userId: Id | null
}

@injectable()
export class FindPostQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    try {
      const post = await db.post.findUnique({
        include: {
          files: true,
          likes: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          quotation: { include: includePostEmbedded(props.userId) },
          quotations: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          replies: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          reply: { include: includePostEmbedded(props.userId) },
          user: { include: { iconImage: true } },
        },
        where: { id: props.postId.value },
      })

      if (post === null) {
        return new NotFoundError()
      }

      return this.queryConverter.toPost(post)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
