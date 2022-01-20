import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../errors/AppError";
import { ITokensRepository } from "../../repositories/ITokensRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

// This UseCase is responsible to delete all user's tokens
// When user changes or resets its password it is a good practice to delete all tokens,
// So user has to authenticate and/or request any confirmation again.
// When deleting user, the tokens should be delete together, because there is no more need
// to have this information saved
@injectable()
class DeleteUserTokensUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository
    ) { }

    async execute(userId: string): Promise<void> {

        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        // If user exists, find all tokens from that user
        const tokens = await this.tokensRepository.findAllByUserId(user.id)

        // And iterate over the array to delete each one of them
        tokens.forEach(async token => await this.tokensRepository.delete(token.id))
    }
}

export { DeleteUserTokensUseCase }