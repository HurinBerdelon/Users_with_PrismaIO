import 'reflect-metadata'
import { tokenType } from "../../../../config/tokenType"
import { AppError } from "../../../../errors/AppError"
import { DateProvider } from "../../../../shared/container/providers/dateProvider/implementations/DateProvider"
import { TokensRepositoryInMemory } from "../../repositories/inMemory/ItokensRepositoryInMemory"
import { UsersRepositoryInMemory } from "../../repositories/inMemory/UsersRepositoryInMemory"
import { DeleteUserTokensUseCase } from "./deleteUserTokensUseCase"

let usersRepositoryInMemory: UsersRepositoryInMemory
let tokensRepositoryInMemory: TokensRepositoryInMemory
let dateProvider: DateProvider
let deleteUserTokensUseCase: DeleteUserTokensUseCase

// The test of Delete user tokens useCase should cover if all tokens are being deleted and 
// if there is an error taking place when user does not exists
describe('Delete User Tokens UseCase', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        dateProvider = new DateProvider()
        deleteUserTokensUseCase = new DeleteUserTokensUseCase(
            usersRepositoryInMemory,
            tokensRepositoryInMemory
        )
    })

    // The first tests create an user and create two tokens,
    // Then the deleteUserTokensUseCase is called and we expect the tokensRepository to be empty.
    it('should be able to delete all tokens of user', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'userName',
            password: 'password@test'
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.confirmEmail,
            value: 'a-valid-token',
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.recoverPassword,
            value: 'another-valid-token',
            expiresDate: dateProvider.addHours(3),
            userId: user.id
        })

        await deleteUserTokensUseCase.execute(user.id)

        expect(tokensRepositoryInMemory.repository).toEqual([])
    })

    // This tests checks if an error is being thrown when asking to delete tokens of a non-existent user
    it('should not be able to delete tokens of non-existent user', async () => {
        await tokensRepositoryInMemory.create({
            type: tokenType.confirmEmail,
            value: 'a-valid-token',
            expiresDate: dateProvider.addHours(3),
            userId: 'invalid-user-id'
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.recoverPassword,
            value: 'another-valid-token',
            expiresDate: dateProvider.addHours(3),
            userId: 'invalid-user-id'
        })

        await expect(
            deleteUserTokensUseCase.execute('invalid-user-id')
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })
})