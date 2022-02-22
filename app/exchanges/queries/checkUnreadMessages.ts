import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { CheckUnreadMessageThreadQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"

const checkUnreadMessages = resolver.pipe(
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const checkExchangesQuery = container.resolve(CheckUnreadMessageThreadQuery)

    const existence = await checkExchangesQuery.execute({
      userId: props.userId,
    })

    if (existence instanceof Error) {
      throw existence
    }

    return existence
  }
)

export default withSentry(checkUnreadMessages, "checkUnreadMessages")
