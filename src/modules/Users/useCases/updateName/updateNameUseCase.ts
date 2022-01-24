import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../errors/AppError";
import { IUpdateUserDTO } from "../../DTOs/IUpdateUserDTO";
import { IUserResponseDTO } from "../../DTOs/IUserResponseDTO";
import { UserMap } from "../../mapper/userMap";
import { IUsersRepository } from "../../repositories/IUsersRepository";

// UpdateNameUseCase has the simple responsibility to receive data from the controller,
// checks if user exists, throwing an error if not
// And call updateName function in usersRepository
@injectable()
class UpdateNameUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) { }

    async execute({ user_id, name }: IUpdateUserDTO): Promise<IUserResponseDTO> {

        const user = await this.usersRepository.findById(user_id)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        const userUpdated = await this.usersRepository.updateName({
            user_id,
            name
        })

        return UserMap.toDTO(userUpdated)
    }
}

export { UpdateNameUseCase }