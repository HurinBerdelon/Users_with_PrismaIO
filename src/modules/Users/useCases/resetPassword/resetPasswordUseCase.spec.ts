import { hash } from 'bcrypt'
import 'reflect-metadata'
import { tokenType } from '../../../../config/tokenType'
import { AppError } from '../../../../errors/AppError'
import { DateProvider } from '../../../../shared/container/providers/dateProvider/implementations/DateProvider'
import { TokensRepositoryInMemory } from '../../repositories/inMemory/ItokensRepositoryInMemory'
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory'
import { ResetPasswordUseCase } from './resetPasswordUseCase'

let usersRepositoryInMemory: UsersRepositoryInMemory
let tokensRepositoryInMemory: TokensRepositoryInMemory
let dateProvider: DateProvider
let resetPasswordUseCase: ResetPasswordUseCase

// To test the ResetPassword UseCase it is needed to:
// Check if password is being recovered,
// Check if a message of password missing is being sent as error,
// Check if token is valid and no expired,
// Check if user still exists,
// encrypt the password
// Update user's password
describe('ResetPassword UseCase', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        dateProvider = new DateProvider()
        resetPasswordUseCase = new ResetPasswordUseCase(
            usersRepositoryInMemory,
            tokensRepositoryInMemory,
            dateProvider
        )
    })

    // This test creates an user, a recoverToken and call resetPasswordUseCase
    // It is expected that new password is diferent from oldPassword
    it('should be able to create a new password for user', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        const oldPassword = user.password

        await tokensRepositoryInMemory.create({
            type: tokenType.recoverPassword,
            value: 'a-valid-recover-token',
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await resetPasswordUseCase.execute('a-valid-recover-token', 'new@password')

        const userUpdated = await usersRepositoryInMemory.findById(user.id)

        expect(userUpdated.password).not.toEqual(oldPassword)
    })

    // This test creates an user and a recover Token and pass only the token to the UseCase
    // It is expected an error of password missing to be thrown
    it('should be able to return password missing error', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.recoverPassword,
            value: 'a-valid-recover-token',
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await expect(
            resetPasswordUseCase.execute('a-valid-recover-token', '')
        ).rejects.toEqual(new AppError('Password Missing!', 401))
    })

    // This test tries to reset password with an invalid token
    // An error is expected to be thrown
    it('should not be able to create new password if token is invalid', async () => {
        await expect(
            resetPasswordUseCase.execute('an-invalid-recover-token', '')
        ).rejects.toEqual(new AppError('Invalid Token!', 401))
    })

    // This test tries to reset password with an expired token
    // An error is expected to be thrown
    it('should not be able to create new password if token is expired', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.recoverPassword,
            value: 'a-valid-recover-token',
            expiresDate: dateProvider.addHours(-3),
            userId: user.id
        })

        await expect(
            resetPasswordUseCase.execute('a-valid-recover-token', '')
        ).rejects.toEqual(new AppError('Token has expired!', 401))
    })

    // This test tries to reset password of an non-existent user
    // An error is expected to be thrown
    it('should not be able to create new password if user no longer exists', async () => {

        await tokensRepositoryInMemory.create({
            type: tokenType.recoverPassword,
            value: 'a-valid-recover-token',
            expiresDate: dateProvider.addHours(3),
            userId: 'invalid-user-id'
        })

        await expect(
            resetPasswordUseCase.execute('a-valid-recover-token', '')
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })


})