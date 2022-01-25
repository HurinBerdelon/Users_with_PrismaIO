import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../../errors/AppError";
import { IDateProvider } from "../../../../../shared/container/providers/dateProvider/IDateProvider";
import { IUpdateUserDTO } from "../../../DTOs/IUpdateUserDTO";
import { IUserResponseDTO } from "../../../DTOs/IUserResponseDTO";
import { UserMap } from "../../../mapper/userMap";
import { ITokensRepository } from "../../../repositories/ITokensRepository";
import { IUsersRepository } from "../../../repositories/IUsersRepository";

// UpdateEmailUseCase has the simple responsibility to receive data from the controller,
// check if token exists and if it is not expired, thrown an error if not for one of that,
// check if user exists, throwing an error if not,
// check if password is correct, throwing an error if not,
// parse the e-mail from the token
// call updateEmail function in usersRepository
// and call confirmEmail function in usersRepository
@injectable()
class UpdateEmailUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) { }

    async execute(token: string, password: string): Promise<IUserResponseDTO> {

        const confirmationToken = await this.tokensRepository.findByToken(token)

        if (!confirmationToken) {
            throw new AppError('Invalid Token', 401)
        }

        const user = await this.usersRepository.findById(confirmationToken.userId)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        const tokenValid = this.dateProvider.compareExpiration(confirmationToken.expiresAt)

        if (!tokenValid) {
            throw new AppError('Token has expired', 401)
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new AppError('Invalid Password', 401)
        }

        const [, email] = token.split('#_!')

        const userUpdated = await this.usersRepository.updateEmail({
            user_id: user.id,
            email
        })

        await this.usersRepository.confirmEmail(userUpdated.email)

        return UserMap.toDTO(userUpdated)
    }
}

export { UpdateEmailUseCase }