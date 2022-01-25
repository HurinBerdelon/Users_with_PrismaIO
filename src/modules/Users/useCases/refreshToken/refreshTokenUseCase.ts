import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { ITokenProvider } from "../../../../shared/container/providers/generateToken/ITokenProvider";
import { IAuthenticateUserDTO } from "../../DTOs/IAuthenticateUserDTO";
import { ITokensRepository } from "../../repositories/ITokensRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

// refreshToken UseCase is responsible for:
// Check if the refreshToken exists and if it is not expired,
// Check if user still exists
// Create new accessToken and new refreshToken, delete the old refreshToken and return it together with user
@injectable()
class RefreshTokenUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository,
        @inject('TokenProvider')
        private tokenProvider: ITokenProvider,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) { }

    async execute(refresh_token: string): Promise<IAuthenticateUserDTO> {

        const refreshToken = await this.tokensRepository.findByToken(refresh_token)

        if (!refreshToken) {
            throw new AppError('Invalid Token!', 401)
        }

        const tokenValid = this.dateProvider.compareExpiration(refreshToken.expiresAt)

        if (!tokenValid) {
            throw new AppError('Token has expired!', 401)
        }

        const user = await this.usersRepository.findById(refreshToken.userId)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        const accessToken = await this.tokenProvider.accessToken(user.id)
        const new_refreshToken = await this.tokenProvider.refreshToken()

        await this.tokensRepository.delete(refreshToken.id)

        return {
            user: {
                name: user.name,
                email: user.email,
                username: user.username
            },
            accessToken,
            refreshToken: new_refreshToken
        }
    }

}

export { RefreshTokenUseCase }