import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUsernameUseCase } from "./updateUsernameUseCase";

// UpdateUsernameController has the simple responsibility to receive data from the request body and request user,
// Inject the UseCase using tsyringe container
// and call the method execute of UseCase
class UpdateUsernameController {

    async handle(request: Request, response: Response): Promise<Response> {

        const { id: user_id } = request.user

        const { username } = request.body

        const updateUsernameUseCase = container.resolve(UpdateUsernameUseCase)

        const result = await updateUsernameUseCase.execute({
            user_id,
            username
        })

        return response.json(result)
    }
}

export { UpdateUsernameController }