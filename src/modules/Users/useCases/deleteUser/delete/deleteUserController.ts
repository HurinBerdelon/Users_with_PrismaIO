import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteUserUseCase } from "./deleteUserUseCase";

// The controller to Delete User receives the token sent by e-mail on request headers
// and pass it to the UseCase, where the business rule is made.
// The UseCase returns void, so, when its execution finishs, a 204 - No Content is returned 
// by the controller
class DeleteUserController {
    async handle(request: Request, response: Response): Promise<Response> {

        const token = request.headers['x-delete-account-token'] as string

        const deleteUserUseCase = container.resolve(DeleteUserUseCase)

        await deleteUserUseCase.execute(token)

        return response.status(204).send()
    }
}

export { DeleteUserController }