import { Request, Response } from "express"
import { container } from "tsyringe"
import emailSubject from "../../../../../config/emailSubject"
import envConfig from "../../../../../config/envConfig"
import { tokenType } from "../../../../../config/tokenType"
import { TokenProvider } from "../../../../../shared/container/providers/generateToken/implementations/TokenProvider"
import { SendEmailUseCase } from "../../sendEmail/sendEmailUseCase"

// SendUpdateEmailController has the simple responsibility to receive data from the request body and request user,
// Inject the UseCase using tsyringe container
// And call the sendEmail UseCase, passing all information about e-mail update
class SendUpdateEmailController {

    async handle(request: Request, response: Response): Promise<Response> {

        const { id: user_id } = request.user

        const { new_email } = request.body

        const sendEmailUseCase = container.resolve(SendEmailUseCase)
        const tokenProvider = container.resolve(TokenProvider)

        const result = await sendEmailUseCase.execute({
            user_id,
            email: new_email,
            token: await tokenProvider.changeEmailToken(new_email),
            token_type: tokenType.updateEmail,
            emailSubject: emailSubject.updateEmail,
            link: envConfig.updateEmailURL,
            template: 'updateEmail.hbs'
        })

        return response.json(result)
    }
}

export { SendUpdateEmailController }