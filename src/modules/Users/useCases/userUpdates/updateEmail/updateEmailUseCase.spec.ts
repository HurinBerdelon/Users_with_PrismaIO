import 'reflect-metadata'
import { tokenType } from '../../../../../config/tokenType'
import { TokenProvider } from "../../../../../shared/container/providers/generateToken/implementations/TokenProvider"
import { DateProvider } from '../../../../../shared/container/providers/dateProvider/implementations/DateProvider'
import { TokensRepositoryInMemory } from '../../../repositories/inMemory/ItokensRepositoryInMemory'
import { UsersRepositoryInMemory } from '../../../repositories/inMemory/UsersRepositoryInMemory'
import { UpdateEmailUseCase } from './updateEmailUseCase'
import { hash } from 'bcrypt'
import { AppError } from '../../../../../errors/AppError'

let usersRepositoryInMemory: UsersRepositoryInMemory
let tokensRepositoryInMemory: TokensRepositoryInMemory
let dateProvider: DateProvider
let tokenProvider: TokenProvider
let updateEmailUseCase: UpdateEmailUseCase

// To test the UpdateEmail UseCase, it is needed just to check:
// If e-mail is being updated,
// If the user exists before update the email,
// If the token is valid and not expired
// If the password is being passed correctly
describe('Update Email UseCase', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        dateProvider = new DateProvider()
        tokenProvider = new TokenProvider()
        updateEmailUseCase = new UpdateEmailUseCase(
            usersRepositoryInMemory,
            tokensRepositoryInMemory,
            dateProvider
        )
    })

    // This test creates an user and an updateEmail token in memory
    // And update the e-mail, it is expected that user's email after the process to be equal to new e-mail passed
    it('should be able to update and confirm new user\'s e-mail', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        const token = await tokenProvider.changeEmailToken('new_email@test.com')

        await tokensRepositoryInMemory.create({
            type: tokenType.updateEmail,
            value: token,
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await updateEmailUseCase.execute(token, 'password@test')

        const userUpdated = await usersRepositoryInMemory.findById(user.id)

        expect(userUpdated.email).toEqual('new_email@test.com')
        expect(userUpdated.emailConfirmed).toEqual(true)
    })

    // This test creates an user and a updateEmail token, but pass only the token to the useCase
    // It is expected an "Password Missing" error to be thrown
    it('should be able to return a "password missing" error, if missing only password', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        const token = await tokenProvider.changeEmailToken('new_email@test.com')

        await tokensRepositoryInMemory.create({
            type: tokenType.updateEmail,
            value: token,
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await expect(
            updateEmailUseCase.execute(token, '')
        ).rejects.toEqual(new AppError('Password Missing!', 401))
    })

    // This test creates an user and an updateEmail token in memory
    // And tries to update user's e-mail with a wrong token
    // An error is expected to be thrown
    it('should not be able to update user\'s e-mail if the token is invalid', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        const token = await tokenProvider.changeEmailToken('new_email@test.com')

        await tokensRepositoryInMemory.create({
            type: tokenType.updateEmail,
            value: token,
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await expect(
            updateEmailUseCase.execute('invalid-token', 'password@test')
        ).rejects.toEqual(new AppError('Invalid Token', 401))
    })

    // This test creates an updateEmail token in memory, but does not creates an user
    // And tries to update user's e-mail with a token from no-existent user
    // An error is expected to be thrown
    it('should not be able to update user\'s e-mail if the token is invalid', async () => {

        const token = await tokenProvider.changeEmailToken('new_email@test.com')

        await tokensRepositoryInMemory.create({
            type: tokenType.updateEmail,
            value: token,
            expiresDate: dateProvider.addHours(3),
            userId: 'invalid-user-id'
        })

        await expect(
            updateEmailUseCase.execute(token, 'password@test')
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })

    // This test creates an user and an updateEmail token in memory
    // And tries to update user's e-mail with an expired token
    // An error is expected to be thrown
    it('should not be able to update user\'s e-mail if the token is expired', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        const token = await tokenProvider.changeEmailToken('new_email@test.com')

        await tokensRepositoryInMemory.create({
            type: tokenType.updateEmail,
            value: token,
            expiresDate: dateProvider.addHours(-3),
            userId: user.id
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await expect(
            updateEmailUseCase.execute(token, 'password@test')
        ).rejects.toEqual(new AppError('Token has expired', 401))
    })

    // This test creates an user and an updateEmail token in memory
    // And tries to update user's e-mail with an incorrect password
    // An error is expected to be thrown
    it('should not be able to update user\'s e-mail if the password is incorrect', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        const token = await tokenProvider.changeEmailToken('new_email@test.com')

        await tokensRepositoryInMemory.create({
            type: tokenType.updateEmail,
            value: token,
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await expect(
            updateEmailUseCase.execute(token, 'wrong@password')
        ).rejects.toEqual(new AppError('Invalid Password', 401))
    })
})