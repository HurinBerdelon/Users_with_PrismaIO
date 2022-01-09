import { ICreateUserDTO } from "../DTOs/ICreateUserDTO";
import { IResponseUserDTO } from "../DTOs/IResponseUserDTO";

interface IUserRepository {
    create({ name, email, username, password }: ICreateUserDTO): Promise<IResponseUserDTO>

    findById(id: string): Promise<IResponseUserDTO>
    findByEmail(email: string): Promise<IResponseUserDTO>
    findByUsername(username: string): Promise<IResponseUserDTO>

    // updateUsername(username: string): Promise<IResponseUserDTO>
    // updateName(name: string): Promise<IResponseUserDTO>
    // updateAvatar(avatar: string): Promise<IResponseUserDTO>
    // updatePassword(password: string): Promise<IResponseUserDTO>

    delete(id: string): Promise<void>
}

export { IUserRepository }