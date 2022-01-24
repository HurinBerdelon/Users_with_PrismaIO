import { v4 as uuidv4 } from 'uuid'

import { User } from "@prisma/client";
import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";
import { DateProvider } from '../../../../shared/container/providers/dateProvider/implementations/DateProvider';
import { container } from 'tsyringe';
import { IUpdateUserDTO } from '../../DTOs/IUpdateUserDTO';

const dateProvider = container.resolve(DateProvider)

// It's a good practice to have a InMemory Repository to implement unitary tests on this repository, no compromising the real database
// It's a mirror of the real Repository, but here we store information in an array in memory and use array methods and attributes, instead of connect to the database with prisma
class UsersRepositoryInMemory implements IUsersRepository {

    // Declaration of the array object, as an empty array of type User (the model created in schema.prisma)
    usersrepository: User[] = []

    // To create a object here, we simply create it and push into the array, this function doesn't need to be assynchronous, but it's defined this way, because it's implementing the interface of the real repository, so it becomes a mirror repository
    async create({ name, email, username, password }: ICreateUserDTO): Promise<User> {

        // e-mails and usernames are case insensitve, so they are converted to lowercase before save and search in database
        email = email.toLowerCase()
        username = username.toLowerCase()

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

        email = email.toLowerCase()

        const user = this.usersrepository.find(user => user.email === email)

        return user
    }

    async findByUsername(username: string): Promise<User> {

        username = username.toLowerCase()

        const user = this.usersrepository.find(user => user.username === username)

        return user
    }

    async confirmEmail(email: string): Promise<User> {

        email = email.toLowerCase()

        const user = this.usersrepository.find(user => user.email === email)

        Object.assign(user, {
            emailConfirmed: true,
            updatedAt: dateProvider.dateNow()
        })

        return user
    }

    async updateUsername({ user_id, username }: IUpdateUserDTO): Promise<User> {

        username = username.toLowerCase()

        const user = this.usersrepository.find(user => user.id === user_id)

        Object.assign(user, {
            username: username,
            updatedAt: dateProvider.dateNow()
        })

        return user
    }

    async updateName({ user_id, name }: IUpdateUserDTO): Promise<User> {

        const user = this.usersrepository.find(user => user.id === user_id)

        Object.assign(user, {
            name: name,
            updatedAt: dateProvider.dateNow()
        })

        return user
    }

    async updateAvatar({ user_id, avatar }: IUpdateUserDTO): Promise<User> {

        const user = this.usersrepository.find(user => user.id === user_id)

        Object.assign(user, {
            avatar: avatar,
            updatedAt: dateProvider.dateNow()
        })

        return user
    }

    async updateEmail({ user_id, email }: IUpdateUserDTO): Promise<User> {

        email = email.toLowerCase()

        const user = this.usersrepository.find(user => user.id === user_id)

        Object.assign(user, {
            email: email,
            updatedAt: dateProvider.dateNow()
        })

        return user
    }

    async updatePassword({ user_id, new_password }: IUpdateUserDTO): Promise<User> {

        const user = this.usersrepository.find(user => user.id === user_id)

        Object.assign(user, {
            password: new_password,
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