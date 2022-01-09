import { PrismaClient } from "@prisma/client";
import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { IResponseUserDTO } from "../../DTOs/IResponseUserDTO";
import { IUserRepository } from "../IUsersRepository";

class UsersRepository implements IUserRepository {

    private repository = new PrismaClient()

    async create({ name, email, username, password }: ICreateUserDTO): Promise<IResponseUserDTO> {
        const user = await this.repository.user.create({
            data: {
                name,
                email,
                password,
                username,
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                avatar: true,
                password: false,
                createdAt: false,
                updatedAt: false,
                emailConfirmed: false,
                refreshTokens: false
            }
        })

        return user
    }

    async findById(id: string): Promise<IResponseUserDTO> {
        const user = await this.repository.user.findUnique({
            where: {
                id: id
            }
        })

        return user
    }

    async findByEmail(email: string): Promise<IResponseUserDTO> {
        const user = await this.repository.user.findUnique({
            where: {
                email: email
            }
        })

        return user
    }

    async findByUsername(username: string): Promise<IResponseUserDTO> {
        const user = await this.repository.user.findUnique({
            where: {
                username: username
            }
        })

        return user
    }

    async delete(id: string): Promise<void> {
        await this.repository.user.delete({
            where: {
                id: id
            }
        })
    }

}

export { UsersRepository }