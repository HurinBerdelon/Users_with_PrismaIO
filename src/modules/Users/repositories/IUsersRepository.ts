import { User } from "@prisma/client";
import { ICreateUserDTO } from "../DTOs/ICreateUserDTO";

// The interface for the repository types with methods the repository class should have, which parameters should each method receive and which type of return it has to give
interface IUsersRepository {
    create({ name, email, username, password }: ICreateUserDTO): Promise<User>

    findById(id: string): Promise<User>
    findByEmail(email: string): Promise<User>
    findByUsername(username: string): Promise<User>

    // updateUsername(username: string): Promise<User>
    // updateName(name: string): Promise<User>
    // updateAvatar(avatar: string): Promise<User>
    // updatePassword(password: string): Promise<User>

    delete(id: string): Promise<void>
}

export { IUsersRepository }