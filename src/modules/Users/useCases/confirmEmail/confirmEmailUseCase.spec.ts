import 'reflect-metadata'
import { hash } from "bcrypt"
import { tokenType } from "../../../../config/tokenType"
import { AppError } from "../../../../errors/AppError"
import { DateProvider } from "../../../../shared/container/providers/dateProvider/implementations/DateProvider"
import { TokensRepositoryInMemory } from "../../repositories/inMemory/ItokensRepositoryInMemory"
import { UsersRepositoryInMemory } from "../../repositories/inMemory/UsersRepositoryInMemory"
import { ConfirmEmailUseCase } from "./confirmEmailUseCase"

let usersRepositoryInMemory: UsersRepositoryInMemory
let tokensRepositoryInMemory: TokensRepositoryInMemory
let dateProvider: DateProvider
let confirmEmailUseCase: ConfirmEmailUseCase

// This test file is responsible to check if all conditions before confirming user's email are working well
// As much as if the e-mail is being confirmed
describe('Confirm Email Use Case', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        dateProvider = new DateProvider()
        confirmEmailUseCase = new ConfirmEmailUseCase(
            usersRepositoryInMemory,
            tokensRepositoryInMemory,
            dateProvider
        )
    })

    // This test creates an user and a token to confirm its email, then call confirmEmailUseCase and expect
    // the attribute emailConfirmed to be true
    it('should be able to confirm user\'s email', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.confirmEmail,
            value: 'a-valid-token',
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        const result = await confirmEmailUseCase.execute({
            token: 'a-valid-token'
        })

        expect(result.message).toEqual('E-mail was confirmed!')
        expect(user.emailConfirmed).toEqual(true)
    })

    // This test creates an user but not a token, and expect a error of invalid token to be thrown
    // when trying to confirm user email
    it('should not be able to confirm user\'s email if token is invalid', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await expect(
            confirmEmailUseCase.execute({
                token: 'an-invalid-token'
            })
        ).rejects.toEqual(new AppError('Invalid Token!'))
    })

    // This test creates an user and a token, but the token with wrong type and expect a error of invalid token to be thrown
    // when trying to confirm user email
    it('should not be able to confirm user\'s email if token is valid but not of type confirmEmail', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.recoverPassword,
            value: 'a-valid-token',
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await expect(
            confirmEmailUseCase.execute({
                token: 'a-valid-token'
            })
        ).rejects.toEqual(new AppError('Invalid Token!'))
    })

    // This test creates an user and a token, but the token is expired and expect a error of invalid token to be thrown
    // when trying to confirm user email
    it('should not be able to confirm user\'s email if token is expired', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.confirmEmail,
            value: 'a-valid-token',
            expiresDate: dateProvider.addHours(-3),
            userId: user.id
        })

        await expect(
            confirmEmailUseCase.execute({
                token: 'a-valid-token'
            })
        ).rejects.toEqual(new AppError('Token has Expired!', 401))
    })

    // this test only creates the token, but not the user. It is expected an error to be thrown when trying to 
    // confirm user's email
    it('should not be able to confirm user\'s email if user does not exists', async () => {
        await tokensRepositoryInMemory.create({
            type: tokenType.confirmEmail,
            value: 'a-valid-token',
            expiresDate: dateProvider.addHours(3),
            userId: 'invalid-user-id'
        })

        await expect(
            confirmEmailUseCase.execute({
                token: 'a-valid-token'
            })
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })
})