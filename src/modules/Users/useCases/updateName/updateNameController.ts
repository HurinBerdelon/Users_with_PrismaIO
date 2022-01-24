import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateNameUseCase } from "./updateNameUseCase";

// UpdateNameController has the simple responsibility to receive data from the request body and request user,
// Inject the UseCase using tsyringe container
// and call the method execute of UseCase
class UpdateNameController {
    async handle(request: Request, response: Response): Promise<Response> {

        const { id: user_id } = request.user
        const { name } = request.body

        const updateNameUseCase = container.resolve(UpdateNameUseCase)

        const result = await updateNameUseCase.execute({
            user_id,
            name
        })

        return response.json(result)
    }
}

export { UpdateNameController }