import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUseCase } from "./resetPasswordUseCase";

// ResetPassword Controller has the responsibility of receive the token in request headers
// And password in request body
// And then call ResetPassword UseCase 
class ResetPasswordController {

    async handle(request: Request, response: Response): Promise<Response> {

        const recover_token = request.headers['x-recover-password-token'] as string

        const { password } = request.body

        const resetPasswordUseCase = container.resolve(ResetPasswordUseCase)

        const result = await resetPasswordUseCase.execute(recover_token, password)

        return response.json(result)
    }
}

export { ResetPasswordController }