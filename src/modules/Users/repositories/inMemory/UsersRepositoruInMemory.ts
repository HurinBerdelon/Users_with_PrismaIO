import { v4 as uuidv4 } from 'uuid'

import { User } from "@prisma/client";
import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { IResponseUserDTO } from "../../DTOs/IResponseUserDTO";
import { IUserRepository } from "../IUsersRepository";


class UsersRepositoryInMemory implements IUserRepository {

    private usersrepository: User[] = []

    async create({ name, email, username, password }: ICreateUserDTO): Promise<IResponseUserDTO> {
        const user: User = {
            id: uuidv4(),
            name,
            email,
            username,
            password,
            avatar: null,
            emailConfirmed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.usersrepository.push(user)

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar
        }
    }

    async findById(id: string): Promise<IResponseUserDTO> {
        const user = this.usersrepository.find(user => user.id === id)

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar
        }
    }

    async findByEmail(email: string): Promise<IResponseUserDTO> {
        const user = this.usersrepository.find(user => user.email === email)

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar
        }
    }

    async findByUsername(username: string): Promise<IResponseUserDTO> {
        const user = this.usersrepository.find(user => user.username === username)

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar
        }
    }

    async delete(id: string): Promise<void> {
        const user = this.usersrepository.find(user => user.id === id)

        this.usersrepository.splice(this.usersrepository.indexOf(user))
    }

}

export { UsersRepositoryInMemory }