import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteUserUseCase } from "./deleteUserUseCase";

class DeleteUserController {
    async handle(request: Request, response: Response): Promise<Response> {

        const token = request.headers['x-delete-account-token'] as string

        const deleteUserUseCase = container.resolve(DeleteUserUseCase)

        await deleteUserUseCase.execute(token)

        return response.status(204)
    }
}

export { DeleteUserController }