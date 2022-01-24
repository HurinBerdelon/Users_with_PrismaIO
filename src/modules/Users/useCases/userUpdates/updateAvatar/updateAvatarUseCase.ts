import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../../errors/AppError";
import { deleteFile } from "../../../../../utils/file";
import { IUpdateUserDTO } from "../../../DTOs/IUpdateUserDTO";
import { IUserResponseDTO } from "../../../DTOs/IUserResponseDTO";
import { UserMap } from "../../../mapper/userMap";
import { IUsersRepository } from "../../../repositories/IUsersRepository";

// UpdateAvatarUseCase has the simple responsibility to receive data from the controller,
// checks if user exists, throwing an error if not,
// delete the user's avatar file if it exists
// And call updateAvatar function in usersRepository
@injectable()
class UpdateAvatarUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) { }

    async execute({ user_id, avatar }: IUpdateUserDTO): Promise<IUserResponseDTO> {

        const user = await this.usersRepository.findById(user_id)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        if (user.avatar) {
            await deleteFile(`./tmp/avatar/${user.avatar}`)
        }

        const userUpdated = await this.usersRepository.updateAvatar({
            user_id: user.id,
            avatar
        })

        return UserMap.toDTO(userUpdated)
    }
}

export { UpdateAvatarUseCase }