import { resolver } from "blitz"
import {
  Id,
  PageService,
  Skip,
  Take,
  Username,
  zSkip,
  zUsername,
} from "integrations/domain"
import { UserReplyQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetUserRepliesInfinite = z.object({
  skip: zSkip,
  username: zUsername,
})

const getUserRepliesInfinite= resolver.pipe(
  resolver.zod(GetUserRepliesInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const app = await createAppContext()

    const posts = await app.get(UserReplyQuery).findMany({
      skip,
      take,
      userId,
      username,
    })

    const count = await app.get(UserReplyQuery).count(username)

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    const isEmpty = posts.length === 0

    return { count, posts, nextPage, hasMore, isEmpty }
  }
)

export default getUserRepliesInfinite
