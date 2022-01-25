import { inject, injectable } from "tsyringe";
import { ITokensRepository } from "../../repositories/ITokensRepository";

// LogoutUser UseCase has the responsibility to receive the refresh token of the controller and delete it from database
@injectable()
class LogoutUserUseCase {

    constructor(
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository
    ) { }

    async execute(refresh_token: string): Promise<void> {

        const refreshToken = await this.tokensRepository.findByToken(refresh_token)

        if (!refreshToken) {
            return
        }

        await this.tokensRepository.delete(refreshToken.id)
    }
}

export { LogoutUserUseCase }