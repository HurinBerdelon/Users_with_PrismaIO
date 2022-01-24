import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdatePasswordUseCase } from "./updatePasswordUseCase";

// UpdatePasswordController has the simple responsibility to receive data from the request body and request user,
// Inject the UseCase using tsyringe container
// and call the method execute of UseCase
class UpdatePasswordController {

    async handle(request: Request, response: Response): Promise<Response> {

        const { id: user_id } = request.user

        const { old_password, new_password } = request.body

        const updatePasswordUseCase = container.resolve(UpdatePasswordUseCase)

        const result = await updatePasswordUseCase.execute({
            user_id,
            old_password,
            new_password
        })

        return response.json(result)
    }
}

export { UpdatePasswordController }