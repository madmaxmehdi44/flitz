import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters/query.converter"
import { PrismaReference } from "integrations/infrastructure/types"
import { includePostEmbedded } from "integrations/infrastructure/utils/includePostEmbedded"
import { AppFolloweePost } from "integrations/interface/types"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  userId: Id
}

@injectable()
export class FindUserReferenceQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    try {
      const references = await db.reference.findMany({
        include: {
          post: {
            include: {
              files: true,
              likes: { where: { userId: props.userId.value } },
              quotation: { include: includePostEmbedded(props.userId) },
              quotations: { where: { userId: props.userId.value } },
              replies: { where: { userId: props.userId.value } },
              reply: { include: includePostEmbedded(props.userId) },
              user: { include: { iconImage: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 16,
        where: { userId: props.userId.value },
      })

      return references.map((reference) => {
        return this.toFolloweePost(reference)
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }

  toFolloweePost(feed: PrismaReference): AppFolloweePost {
    return {
      ...this.queryConverter.toPost(feed.post),
      isRead: feed.isRead,
    }
  }
}
