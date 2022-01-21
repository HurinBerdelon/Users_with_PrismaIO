import { PrismaClient, User } from "@prisma/client";
import { container } from "tsyringe";
import { DateProvider } from "../../../../shared/container/providers/dateProvider/implementations/DateProvider";
import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";

const dateProvider = container.resolve(DateProvider)

// UsersRepository intermediates the access between the database and the application. It's in this class where prisma is used 
class UsersRepository implements IUsersRepository {

    // the object to the repository is a instance of PrismaClient
    private repository = new PrismaClient()

    // To create a database object with prisma, we call the create method of PrismaClient.Model, feeding this method with the information required to create the object. This required information is all the is not optional and not default in schema.prisma
    async create({ name, email, username, password }: ICreateUserDTO): Promise<User> {

        const user = await this.repository.user.create({
            data: {
                name,
                email,
                password,
                username,
            }
        })

        return user
    }

    // To find a information on the database we should findUnique method of PrismaClient.Model, feeding it with the object where and the attribute to filter the information. This attribute of where should be an @unique or @id from the model in schame.prisma
    async findById(id: string): Promise<User> {
        const user = await this.repository.user.findUnique({
            where: {
                id: id
            }
        })

        return user
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.user.findUnique({
            where: {
                email: email
            }
        })

        return user
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.repository.user.findUnique({
            where: {
                username: username
            }
        })

        return user
    }

    async confirmEmail(email: string): Promise<User> {
        const user = await this.repository.user.update({
            where: {
                email: email
            },
            data: {
                emailConfirmed: true,
                updatedAt: dateProvider.dateNow()
            }
        })

        return user
    }

    // Delete method works similarly to findUnique, but instead of only bring the object, delete brings it and delete from the database
    async delete(id: string): Promise<void> {
        await this.repository.user.delete({
            where: {
                id: id
            },
        })
    }

}

export { UsersRepository }