import { v4 as uuidv4 } from 'uuid'

import { User } from "@prisma/client";
import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";
import { DateProvider } from '../../../../shared/container/providers/dateProvider/implementations/DateProvider';
import { container } from 'tsyringe';

const dateProvider = container.resolve(DateProvider)

// It's a good practice to have a InMemory Repository to implement unitary tests on this repository, no compromising the real database
// It's a mirror of the real Repository, but here we store information in an array in memory and use array methods and attributes, instead of connect to the database with prisma
class UsersRepositoryInMemory implements IUsersRepository {

    // Declaration of the array object, as an empty array of type User (the model created in schema.prisma)
    usersrepository: User[] = []

    // To create a object here, we simply create it and push into the array, this function doesn't need to be assynchronous, but it's defined this way, because it's implementing the interface of the real repository, so it becomes a mirror repository
    async create({ name, email, username, password }: ICreateUserDTO): Promise<User> {
        const user: User = {
            id: uuidv4(),
            name: name,
            email: email,
            username: username,
            password: password,
            avatar: null,
            emailConfirmed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.usersrepository.push(user)

        return user
    }

    // to find an object in an array, we iterate in the array and return the object that matchs the condition of iteration
    async findById(id: string): Promise<User> {
        const user = this.usersrepository.find(user => user.id === id)

        return user
    }

    async findByEmail(email: string): Promise<User> {
        const user = this.usersrepository.find(user => user.email === email)

        return user
    }

    async findByUsername(username: string): Promise<User> {
        const user = this.usersrepository.find(user => user.username === username)

        return user
    }

    async confirmEmail(email: string): Promise<User> {
        const user = this.usersrepository.find(user => user.email === email)

        Object.assign(user, {
            emailConfirmed: true,
            updatedAt: dateProvider.dateNow()
        })

        return user
    }

    // to delete a object of the array, we first find this object and pass its index for the splice array method
    async delete(id: string): Promise<void> {
        const user = this.usersrepository.find(user => user.id === id)

        this.usersrepository.splice(this.usersrepository.indexOf(user))
    }

}

export { UsersRepositoryInMemory }