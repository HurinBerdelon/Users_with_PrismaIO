import 'reflect-metadata'
import { AppError } from '../../../../errors/AppError'

import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory'
import { CreateUserUseCase } from "./createUserUseCase"

let usersRepositoryInMemory: UsersRepositoryInMemory
let createUserUseCase: CreateUserUseCase

describe('Create User Use Case', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it('should be able to create a new user', async () => {

        const createUserDTO = {
            name: 'Name test',
            email: 'email@test.com',
            username: 'usertest',
            password: 'password'
        }

        const user = await createUserUseCase.execute(createUserDTO)

        expect(user).toHaveProperty('id')
        expect(user.avatar).toBeNull()
    })

    it('should not be able to create a new user with a email already in use', async () => {
        const createUserDTO = {
            name: 'Name test',
            email: 'email@test.com',
            username: 'usertest',
            password: 'password'
        }

        await createUserUseCase.execute(createUserDTO)

        await expect(
            createUserUseCase.execute({
                name: createUserDTO.name,
                email: createUserDTO.email,
                username: 'anotherUsertest',
                password: createUserDTO.password
            })
        ).rejects.toEqual(new AppError(`User with e-mail ${createUserDTO.email} already exists!`))
    })

    it('should not be able to create a new user with an username already in use', async () => {
        const createUserDTO = {
            name: 'Name test',
            email: 'email@test.com',
            username: 'usertest',
            password: 'password'
        }

        await createUserUseCase.execute(createUserDTO)

        await expect(
            createUserUseCase.execute({
                name: createUserDTO.name,
                email: 'another@email.com',
                username: createUserDTO.username,
                password: createUserDTO.password
            })
        ).rejects.toEqual(new AppError(`User with username ${createUserDTO.username} already exists!`))
    })
})