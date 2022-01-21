import { Request, Response } from "express";
import { container } from "tsyringe";
import { ConfirmEmailUseCase } from "./confirmEmailUseCase";

// This controller has the responsibility of receiving the token from request headers
// And pass it to the UseCase, which returns the message to send to client
class ConfirmEmailController {

    async handle(request: Request, response: Response): Promise<Response> {

        const confirmationToken = request.headers['x-confirm-email-token'] as string

        const confirmEmailUseCase = container.resolve(ConfirmEmailUseCase)

        const result = await confirmEmailUseCase.execute({ token: confirmationToken })

        return response.status(200).json(result)
    }
}

export { ConfirmEmailController }