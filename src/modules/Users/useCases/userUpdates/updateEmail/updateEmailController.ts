import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateEmailUseCase } from "./updateEmailUseCase";

// The controller to update User's email receives the token sent by e-mail on request headers
// and pass it to the UseCase, where the business rule is made.
// The UseCase returns userMap of userUpdated, and then this user map is returned by the controller
class UpdateEmailController {

    async handle(request: Request, response: Response): Promise<Response> {

        const token = request.headers['x-update-email-token'] as string

        const { password } = request.body

        const updateEmailUseCase = container.resolve(UpdateEmailUseCase)

        const result = await updateEmailUseCase.execute(token, password)

        return response.json(result)
    }
}

export { UpdateEmailController }