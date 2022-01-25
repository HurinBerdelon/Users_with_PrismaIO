import { Request, Response } from "express";
import { container } from "tsyringe";
import emailSubject from "../../../../config/emailSubject";
import envConfig from "../../../../config/envConfig";
import { tokenType } from "../../../../config/tokenType";
import { TokenProvider } from "../../../../shared/container/providers/generateToken/implementations/TokenProvider";
import { SendEmailUseCase } from "../sendEmail/sendEmailUseCase";

// The responsibility of this controller is to feed the sendEmailUseCase with the information
// about recoverPassword, so user can receive a link on e-mail to recover his password
class SendResetPasswordEmailController {

    async handle(request: Request, response: Response): Promise<Response> {

        const { email } = request.body

        const sendEmailUseCase = container.resolve(SendEmailUseCase)
        const tokenProvider = container.resolve(TokenProvider)

        const result = await sendEmailUseCase.execute({
            email,
            emailSubject: emailSubject.recoverPassword,
            link: envConfig.recoverEmailURL,
            token: await tokenProvider.recoverPasswordToken(),
            token_type: tokenType.recoverPassword,
            template: 'recoverPassword.hbs'
        })

        return response.json(result)
    }
}

export { SendResetPasswordEmailController }