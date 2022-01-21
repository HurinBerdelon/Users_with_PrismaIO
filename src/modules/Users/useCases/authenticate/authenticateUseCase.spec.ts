import 'reflect-metadata'
import { hash } from "bcrypt"
import { AppError } from "../../../../errors/AppError"
import { DateProvider } from "../../../../shared/container/providers/dateProvider/implementations/DateProvider"
import { TokenProvider } from "../../../../shared/container/providers/generateToken/implementations/TokenProvider"
import { MailProviderInMemory } from "../../../../shared/container/providers/mailProvider/inMemory/mailProviderInMemory"
import { TokensRepositoryInMemory } from "../../repositories/inMemory/ItokensRepositoryInMemory"
import { UsersRepositoryInMemory } from "../../repositories/inMemory/UsersRepositoryInMemory"
import { AuthenticateUseCase } from "./authenticateUseCase"

let usersRepositoryInMemory: UsersRepositoryInMemory
let tokensRepositoryInMemory: TokensRepositoryInMemory
let tokenProvider: TokenProvider
let dateProvider: DateProvider
let mailProviderInMemory: MailProviderInMemory
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        tokenProvider = new TokenProvider()
        dateProvider = new DateProvider()
        mailProviderInMemory = new MailProviderInMemory()
        authenticateUseCase = new AuthenticateUseCase(
            usersRepositoryInMemory,
            tokensRepositoryInMemory,
            dateProvider,
            tokenProvider,
            mailProviderInMemory
        )
    })


    it('should be able to authenticate user with email', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            username: 'UserTest',
            email: 'email@test.com',
            password: await hash('password@test', 8)
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        const result = await authenticateUseCase.execute({
            login: user.email,
            password: 'password@test'
        })

        expect(result).toHaveProperty('user')
        expect(result).toHaveProperty('accessToken')
        expect(result).toHaveProperty('refreshToken')
    })

    it('should be able to authenticate user with username', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            username: 'UserTest',
            email: 'email@test.com',
            password: await hash('password@test', 8)
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        const result = await authenticateUseCase.execute({
            login: user.username,
            password: 'password@test'
        })

        expect(result).toHaveProperty('user')
        expect(result).toHaveProperty('accessToken')
        expect(result).toHaveProperty('refreshToken')
    })

    it('should be able to send a confirmation email if user with email not confirmed tries to authenticate', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            username: 'UserTest',
            email: 'email@test.com',
            password: await hash('password@test', 8)
        })

        const mailSent = jest.spyOn(mailProviderInMemory, 'sendMail')

        await expect(
            authenticateUseCase.execute({
                login: user.email,
                password: 'password@test'
            })
        ).rejects.toEqual(new AppError(`A link has been sent to ${user.email} to confirm your registration!`))

        expect(mailSent).toHaveBeenCalled()
    })

    it('should not be able to authenticate user with incorrect username', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            username: 'UserTest',
            email: 'email@test.com',
            password: await hash('password@test', 8)
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await expect(
            authenticateUseCase.execute({
                login: 'wrong_username',
                password: 'password@test'
            })
        ).rejects.toEqual(new AppError('Login or Password incorrect!'))
    })

    it('should not be able to authenticate user with incorrect email', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            username: 'UserTest',
            email: 'email@test.com',
            password: await hash('password@test', 8)
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await expect(
            authenticateUseCase.execute({
                login: 'wrong_email',
                password: 'password@test'
            })
        ).rejects.toEqual(new AppError('Login or Password incorrect!'))
    })

    it('should not be able to authenticate user with incorrect password', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            username: 'UserTest',
            email: 'email@test.com',
            password: await hash('password@test', 8)
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await expect(
            authenticateUseCase.execute({
                login: user.email,
                password: 'wrong_password'
            })
        ).rejects.toEqual(new AppError('Login or Password incorrect!'))
    })

    it('should not be able to authenticate user with email not confirmed', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            username: 'UserTest',
            email: 'email@test.com',
            password: await hash('password@test', 8)
        })

        await expect(
            authenticateUseCase.execute({
                login: user.email,
                password: 'password@test'
            })
        ).rejects.toEqual(new AppError(`A link has been sent to ${user.email} to confirm your registration!`))
    })
})