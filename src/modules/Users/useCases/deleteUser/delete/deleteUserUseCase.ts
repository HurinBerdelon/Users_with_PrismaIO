import { inject, injectable } from "tsyringe";
import { tokenType } from "../../../../../config/tokenType";
import { AppError } from "../../../../../errors/AppError";
import { IDateProvider } from "../../../../../shared/container/providers/dateProvider/IDateProvider";
import { ITokensRepository } from "../../../repositories/ITokensRepository";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { DeleteUserTokensUseCase } from "../../deleteUserTokens/deleteUserTokensUseCase";

// This class is responsible to delete user's account as much as its delete token
// The constructor inject the Users and Tokens Repository as much as the dateProvider
@injectable()
class DeleteUserUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) { }

    async execute(token: string): Promise<void> {

        // execute method only receives the token, sent by e-mail, and find the token in the database
        const deleteToken = await this.tokensRepository.findByToken(token)

        // an expection is thrwon if the token does not exists or if it exists, but is not of type deleteUser
        if (!deleteToken) {
            throw new AppError('Token Invalid!')
        }

        if (deleteToken.type != tokenType.deleteUser) {
            throw new AppError('Token Invalid!')
        }

        // The token is associated to a user, so we find the user and if user is not found, an excpetion is thrown
        const user = await this.usersRepository.findById(deleteToken.userId)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        // token is validated with its expiresAt attribute, and an exception is thrown if the validation fail
        const tokenValid = this.dateProvider.compareExpiration(deleteToken.expiresAt)

        if (!tokenValid) {
            throw new AppError('Token has expired!')
        }

        // Finally, the User's account is deleted and the token generated to delete account is also deleted
        await this.usersRepository.delete(user.id)
    }
}

export { DeleteUserUseCase }