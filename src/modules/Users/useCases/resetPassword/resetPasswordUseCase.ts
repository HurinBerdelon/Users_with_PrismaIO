import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IUserResponseDTO } from "../../DTOs/IUserResponseDTO";
import { UserMap } from "../../mapper/userMap";
import { ITokensRepository } from "../../repositories/ITokensRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

// ResetPasswordUseCase has the responsibility of receiving the token and the password from controller
// Check if token is valid and not expired
// Check if user exists
// Check if password is being received
// Encrypt the password
// Update password in database
@injectable()
class ResetPasswordUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) { }

    async execute(recover_token: string, password: string): Promise<IUserResponseDTO> {

        const recoverToken = await this.tokensRepository.findByToken(recover_token)

        if (!recoverToken) {
            throw new AppError('Invalid Token!', 401)
        }

        const tokenValid = this.dateProvider.compareExpiration(recoverToken.expiresAt)

        if (!tokenValid) {
            throw new AppError('Token has expired!', 401)
        }

        const user = await this.usersRepository.findById(recoverToken.userId)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        if (!password) {
            throw new AppError('Password Missing!', 401)
        }

        const passwordHash = await hash(password, 8)

        const userUpdated = await this.usersRepository.updatePassword({
            user_id: user.id,
            new_password: passwordHash
        })

        await this.tokensRepository.delete(recoverToken.id)

        return UserMap.toDTO(userUpdated)
    }
}

export { ResetPasswordUseCase }