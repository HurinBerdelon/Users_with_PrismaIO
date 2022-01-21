import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUseCase } from "./authenticateUseCase";

class AuthenticateController {

    async handle(request: Request, response: Response): Promise<Response> {

        const { login, password } = request.body

        const authenticateUseCase = container.resolve(AuthenticateUseCase)

        const result = await authenticateUseCase.execute({
            login,
            password
        })

        return response.status(200).json(result)
    }
}

export { AuthenticateController }