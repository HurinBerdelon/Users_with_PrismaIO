import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../../errors/AppError";
import { IUpdateUserDTO } from "../../../DTOs/IUpdateUserDTO";
import { IUserResponseDTO } from "../../../DTOs/IUserResponseDTO";
import { UserMap } from "../../../mapper/userMap";
import { IUsersRepository } from "../../../repositories/IUsersRepository";

// UpdateUsernameUseCase has the simple responsibility to receive data from the controller,
// checks if user exists, throwing an error if not,
// checks if username is already in user, throwing an error if not
// And call updateUsername function in usersRepository
@injectable()
class UpdateUsernameUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) { }

    async execute({ user_id, username }: IUpdateUserDTO): Promise<IUserResponseDTO> {

        const user = await this.usersRepository.findById(user_id)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        const userWithUsername = await this.usersRepository.findByUsername(username)

        if (userWithUsername) {
            throw new AppError('Username already in user!', 401)
        }

        const userUpdated = await this.usersRepository.updateUsername({
            user_id,
            username
        })

        return UserMap.toDTO(userUpdated)
    }
}

export { UpdateUsernameUseCase }