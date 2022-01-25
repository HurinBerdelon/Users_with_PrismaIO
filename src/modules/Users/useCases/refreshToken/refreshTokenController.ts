import { Request, Response } from "express";
import { container } from "tsyringe";
import { RefreshTokenUseCase } from "./refreshTokenUseCase";

// RefreshTokenController is responsible for receiving the refresh-token in request headers
// Pass it to the UseCase and return new refreshToken and accessToken on response.body
class RefreshTokenController {

    async handle(request: Request, response: Response): Promise<Response> {

        const refresh_token = request.headers['x-refresh-token'] as string

        const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)

        const result = await refreshTokenUseCase.execute(refresh_token)

        return response.json(result)
    }
}

export { RefreshTokenController }