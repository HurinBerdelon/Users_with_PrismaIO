import { Request, Response } from "express";
import { container } from "tsyringe";
import { LogoutUserUseCase } from "./logoutUserUseCase";

// LogoutUser Controller has the responsibility of receiving the refresh_token from the request.headers
// and calls the logouUser UseCase, returning No Content
class LogoutUserControler {

    async handle(request: Request, response: Response): Promise<Response> {

        const refresh_token = request.headers['x-refresh-token'] as string

        const logoutUserUseCase = container.resolve(LogoutUserUseCase)

        await logoutUserUseCase.execute(refresh_token)

        return response.status(204).send()
    }
}

export { LogoutUserControler }