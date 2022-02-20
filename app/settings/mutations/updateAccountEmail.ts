import { resolver } from "blitz"
import { UpdateAccountEmailService } from "integrations/application"
import { Email, Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zUpdateAccountEmailMutation = z.object({ email: z.string() })

const updateAccountEmail = resolver.pipe(
  resolver.zod(zUpdateAccountEmailMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      email: new Email(props.email),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const updateAccountEmailService = container.resolve(
      UpdateAccountEmailService
    )

    await updateAccountEmailService.execute({
      email: props.email,
      userId: props.userId,
    })

    return null
  }
)

export default updateAccountEmail
