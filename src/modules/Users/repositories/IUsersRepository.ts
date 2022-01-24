import { User } from "@prisma/client";
import { ICreateUserDTO } from "../DTOs/ICreateUserDTO";
import { IUpdateUserDTO } from "../DTOs/IUpdateUserDTO";

// The interface for the repository types with methods the repository class should have, which parameters should each method receive and which type of return it has to give
interface IUsersRepository {
    create({ name, email, username, password }: ICreateUserDTO): Promise<User>

    findById(id: string): Promise<User>
    findByEmail(email: string): Promise<User>
    findByUsername(username: string): Promise<User>

    confirmEmail(email: string): Promise<User>

    updateUsername({ user_id, username }: IUpdateUserDTO): Promise<User>
    updateName({ user_id, name }: IUpdateUserDTO): Promise<User>
    updateAvatar({ user_id, avatar }: IUpdateUserDTO): Promise<User>
    updateEmail({ user_id, email }: IUpdateUserDTO): Promise<User>
    updatePassword({ user_id, password }: IUpdateUserDTO): Promise<User>

    delete(id: string): Promise<void>
}

export { IUsersRepository }