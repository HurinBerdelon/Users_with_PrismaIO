import { Request, Response } from "express";
import { container } from "tsyringe";
import emailSubject from "../../../../../config/emailSubject";
import envConfig from "../../../../../config/envConfig";
import { tokenType } from "../../../../../config/tokenType";
import { TokenProvider } from "../../../../../shared/container/providers/generateToken/implementations/TokenProvider";
import { SendEmailUseCase } from "../../sendEmail/sendEmailUseCase";

// To send a e-mail for user to confirm its account deletion, we only need a controller, as 
// there is a general sendEmailUseCase.
// The controller must receive the e-mail on request body and call the sendMailUseCase giving 
// the configuration of a delete account email
class SendDeleteEmailController {
    async handle(request: Request, response: Response): Promise<Response> {

        const { email } = request.body

        const sendEmailUseCase = container.resolve(SendEmailUseCase)
        const tokenProvider = container.resolve(TokenProvider)

        const result = await sendEmailUseCase.execute({
            email,
            emailSubject: emailSubject.deleteUser,
            link: envConfig.deleteUserEMAILURL,
            template: 'deleteUser.hbs',
            token: await tokenProvider.confirmationToken(),
            token_type: tokenType.deleteUser
        })

        return response.status(200).json(result)

    }
}

export { SendDeleteEmailController }