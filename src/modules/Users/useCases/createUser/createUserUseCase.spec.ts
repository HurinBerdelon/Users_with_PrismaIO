import 'reflect-metadata'
import { AppError } from '../../../../errors/AppError'
import { TokenProvider } from '../../../../shared/container/providers/generateToken/implementations/TokenProvider'

import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory'
import { CreateUserUseCase } from "./createUserUseCase"
import { TokensRepositoryInMemory } from '../../repositories/inMemory/ItokensRepositoryInMemory'
import { DateProvider } from '../../../../shared/container/providers/dateProvider/implementations/DateProvider'
import { MailProviderInMemory } from '../../../../shared/container/providers/mailProvider/inMemory/mailProviderInMemory'

// Declaration of the class this tests will use
// As the unitary test should cover only the useCase, the repository used here is a ImMemory Repository, because the real database should not be touched by tests
let usersRepositoryInMemory: UsersRepositoryInMemory
let tokensRepositoryInMemory: TokensRepositoryInMemory
let mailProviderInMemory: MailProviderInMemory
let dateProvider: DateProvider
let tokenProvider: TokenProvider
let createUserUseCase: CreateUserUseCase

// Every test should start with describe functionality. We kind uses SOLID in test too. As this file for tests has a single responsibilty of testing the createUserUseCase.
describe('Create User Use Case', () => {

    // Before each instance of test, the useCase and the repository should be initiated
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        tokenProvider = new TokenProvider()
        mailProviderInMemory = new MailProviderInMemory()
        dateProvider = new DateProvider()
        createUserUseCase = new CreateUserUseCase(
            usersRepositoryInMemory,
            tokensRepositoryInMemory,
            tokenProvider,
            dateProvider,
            mailProviderInMemory
        )
    })

    // The first test checks if a new user can be created.
    // CreateUserUseCase returns a json message, that an e-mail has been sent
    it('should be able to create a new user', async () => {

        const createUserDTO = {
            name: 'Name test',
            email: 'email@test.com',
            username: 'usertest',
            password: 'password'
        }

        const result = await createUserUseCase.execute(createUserDTO)

        expect(result).toHaveProperty('message')
        expect(result.message).toEqual(`A link has been sent to ${'email@test.com'} to confirm your operation!`)
    })

    // The second test checks if an execption will be thrown when trying to create a user with a email already in use.
    // First a user is created successfully, and then a second creation is called, with the same email and we expect a expection with specific message to be thrown
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

    // The third test checks if an execption will be thrown when trying to create a user with a username already in use.
    // First a user is created successfully, and then a second creation is called, with the same username and we expect a expection with specific message to be thrown
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