import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { tokenType } from "../../../../config/tokenType";
import { AppError } from "../../../../errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IJsonMessageDTO } from "../../DTOs/IJsonMessageDTO";
import { ITokensRepository } from "../../repositories/ITokensRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

// Type of data received by execute method
interface IRequest {
    token: string
}

// The responsibility of ConfirmEmailUseCase is to confirm user email if all criteria is valid
// It needs injection of users and tokens repositories as much as dateProvider
@injectable()
class ConfirmEmailUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) { }

    async execute({ token }: IRequest): Promise<IJsonMessageDTO> {

        // Find the token object throwing an error if it does not exists or if its type is not confirmEmail
        const confirmationToken = await this.tokensRepository.findByToken(token)

        if (!confirmationToken) {
            throw new AppError('Invalid Token!')
        }

        if (confirmationToken.type != tokenType.confirmEmail) {
            throw new AppError('Invalid Token!')
        }

        // Checks if the tokens is expired or not
        const tokenValid = this.dateProvider.compareExpiration(confirmationToken.expiresAt)

        if (!tokenValid) {
            throw new AppError('Token has Expired!', 401)
        }

        // Find the user which this token belongs to
        const user = await this.usersRepository.findById(confirmationToken.userId)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        // Finally the e-mail is confirmed and the token deleted
        await this.usersRepository.confirmEmail(user.email)

        await this.tokensRepository.delete(confirmationToken.id)

        // A message is return to confirm operation
        return {
            message: 'E-mail was confirmed!'
        }
    }
}

export { ConfirmEmailUseCase }