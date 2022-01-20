import 'reflect-metadata'
import { tokenType } from "../../../../../config/tokenType"
import { AppError } from '../../../../../errors/AppError'
import { DateProvider } from "../../../../../shared/container/providers/dateProvider/implementations/DateProvider"
import { TokensRepositoryInMemory } from "../../../repositories/inMemory/ItokensRepositoryInMemory"
import { UsersRepositoryInMemory } from "../../../repositories/inMemory/UsersRepositoryInMemory"
import { DeleteUserUseCase } from "./deleteUserUseCase"

let usersRepositoryInMemory: UsersRepositoryInMemory
let tokensRepositoryInMemory: TokensRepositoryInMemory
let dateProvider: DateProvider
let deleteUserUseCase: DeleteUserUseCase

// To test if Delete User Use Case is fulfilling his responsibilities, it is needed some individual tests
describe('Delete User Use Case', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        dateProvider = new DateProvider()
        deleteUserUseCase = new DeleteUserUseCase(
            usersRepositoryInMemory,
            tokensRepositoryInMemory,
            dateProvider
        )
    })

    // The first test checks if user is being deleted, as much as its deletion token
    it('should be able to delete an user\'s account', async () => {
        // An user is created
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            password: 'password@test',
            username: 'UserTest'
        })

        // Its email is confirmed
        await usersRepositoryInMemory.confirmEmail(user.email)

        // A deletion Token is created
        await tokensRepositoryInMemory.create({
            type: tokenType.deleteUser,
            expiresDate: dateProvider.addHours(3),
            userId: user.id,
            value: 'deletion_token_valid'
        })

        // And then de method to delete is called
        await deleteUserUseCase.execute('deletion_token_valid')

        // Checks if both repositories are empty, meaning the user and the token were deleted
        expect(usersRepositoryInMemory.usersrepository).toEqual([])
        expect(tokensRepositoryInMemory.repository).toEqual([])
    })

    // This test checks if an error is thrown when trying to delete a non-existing user
    it('should not be able to delete non-existing user\'s account', async () => {
        await tokensRepositoryInMemory.create({
            type: tokenType.deleteUser,
            expiresDate: dateProvider.addHours(3),
            userId: 'invalid_user_id',
            value: 'deletion_token_valid'
        })

        await expect(
            deleteUserUseCase.execute('deletion_token_valid')
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })

    // This test checks if an error is thrown when trying to delete user with an invalid token
    it('should not be able to delete user\'s account if the token is invalid', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            password: 'password@test',
            username: 'UserTest'
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await expect(
            deleteUserUseCase.execute('an-invalid-token')
        ).rejects.toEqual(new AppError('Token Invalid!'))
    })

    // This test checks if an error is thrown when trying to delete user with a valid token, but invalid token type
    it('should not be able to delete user\'s account if the token exists, but it is not of type deleteUser', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            password: 'password@test',
            username: 'UserTest'
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await tokensRepositoryInMemory.create({
            type: tokenType.confirmEmail,
            expiresDate: dateProvider.addHours(3),
            userId: user.id,
            value: 'deletion_token_valid'
        })

        await expect(
            deleteUserUseCase.execute('deletion_token_valid')
        ).rejects.toEqual(new AppError('Token Invalid!'))
    })

    // This test checks if an error is thrown when trying to delete user with expired token
    it('should not be able to delete user\'s account if the token is expired', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            password: 'password@test',
            username: 'UserTest'
        })

        await usersRepositoryInMemory.confirmEmail(user.email)

        await tokensRepositoryInMemory.create({
            type: tokenType.deleteUser,
            expiresDate: dateProvider.addHours(-3),
            userId: user.id,
            value: 'deletion_token_valid'
        })

        await expect(
            deleteUserUseCase.execute('deletion_token_valid')
        ).rejects.toEqual(new AppError('Token has expired!'))
    })
})