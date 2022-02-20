import { zCreateUserMutation } from "app/home/validations/createUserMutation"
import { resolver } from "blitz"
import { SignUpService } from "integrations/application"
import { Email, Password, UserRole } from "integrations/domain"
import { container } from "tsyringe"

const createUser = resolver.pipe(
  resolver.zod(zCreateUserMutation),
  (props) => {
    return {
      email: new Email(props.email),
      password: new Password(props.password),
    }
  },
  async (props, ctx) => {
    const signUpService = container.resolve(SignUpService)

    const user = await signUpService.execute({
      session: ctx.session,
      password: props.password,
      email: props.email,
    })

    if (user instanceof Error) {
      throw user
    }

    await ctx.session.$create({
      name: user.name?.value ?? null,
      role: new UserRole("USER").value,
      userId: user.id.value,
      username: user.username?.value ?? null,
      iconImageId: null,
    })

    return null
  }
)

export default createUser
