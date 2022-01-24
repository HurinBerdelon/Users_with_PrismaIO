import { compare, hash } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../../errors/AppError";
import { IUpdateUserDTO } from "../../../DTOs/IUpdateUserDTO";
import { IUserResponseDTO } from "../../../DTOs/IUserResponseDTO";
import { UserMap } from "../../../mapper/userMap";
import { ITokensRepository } from "../../../repositories/ITokensRepository";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { DeleteUserTokensUseCase } from "../../deleteUserTokens/deleteUserTokensUseCase";

// UpdatePasswordUseCase has the simple responsibility to receive data from the controller,
// Checks if user exists, throwing an error if not,
// Checks if the old_password matchs, throwing an error if not,
// Encrypt the new_password,
// Call updatePassword function in usersRepository 
// And finally, after password update, delete all tokens from that user, so the authentication must be done again.
@injectable()
class UpdatePasswordUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository
    ) { }

    async execute({ user_id, new_password, old_password }: IUpdateUserDTO): Promise<IUserResponseDTO> {

        const user = await this.usersRepository.findById(user_id)

        if (!user) {
            throw new AppError('User not Found', 404)
        }

        const passwordMatch = await compare(old_password, user.password)

        if (!passwordMatch) {
            throw new AppError('Old Password is invalid', 401)
        }

        const passwordHash = await hash(new_password, 8)

        const userUpdated = await this.usersRepository.updatePassword({
            user_id: user.id,
            new_password: passwordHash
        })

        const deleteUserTokens = new DeleteUserTokensUseCase(this.usersRepository, this.tokensRepository)

        await deleteUserTokens.execute(user.id)

        return UserMap.toDTO(userUpdated)
    }
}

export { UpdatePasswordUseCase }