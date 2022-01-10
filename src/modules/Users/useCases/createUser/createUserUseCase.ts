import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../errors/AppError";
import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { IUserResponseDTO } from "../../DTOs/IUserResponseDTO";
import { UserMap } from "../../mapper/userMap";
import { IUsersRepository } from "../../repositories/IUsersRepository";


@injectable()
class CreateUserUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) { }

    async execute({ name, username, email, password }: ICreateUserDTO): Promise<IUserResponseDTO> {
        const userWithEmail = await this.usersRepository.findByEmail(email)

        if (userWithEmail) {
            throw new AppError(`User with e-mail ${email} already exists!`)
        }

        const userWithUsername = await this.usersRepository.findByUsername(username)

        if (userWithUsername) {
            throw new AppError(`User with username ${username} already exists!`)
        }

        const passwordHash = await hash(password, 8)

        const user = await this.usersRepository.create({
            name,
            username,
            email,
            password: passwordHash
        })

        return UserMap.toDTO(user)
    }
}

export { CreateUserUseCase }