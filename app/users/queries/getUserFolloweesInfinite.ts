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
import { UserFolloweeQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const zGetUserFolloweesInfinite = z.object({
  skip: zSkip,
  username: zUsername,
})

const getUserFolloweesInfinite = resolver.pipe(
  resolver.zod(zGetUserFolloweesInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const app = await createAppContext()

    const friendships = await app.get(UserFolloweeQuery).findByUsername({
      skip,
      take,
      userId,
      username,
    })

    const count = await app.get(UserFolloweeQuery).count({ username })

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    return { count, hasMore, friendships, nextPage }
  }
)

export default getUserFolloweesInfinite
