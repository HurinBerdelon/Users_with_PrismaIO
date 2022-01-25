import 'reflect-metadata'
import { hash } from 'bcrypt'
import { tokenType } from '../../../../config/tokenType'
import { DateProvider } from '../../../../shared/container/providers/dateProvider/implementations/DateProvider'
import { TokensRepositoryInMemory } from '../../repositories/inMemory/ItokensRepositoryInMemory'
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory'
import { LogoutUserUseCase } from './logoutUserUseCase'

let tokensRepositoryInMemory: TokensRepositoryInMemory
let usersRepositoryInMemory: UsersRepositoryInMemory
let dateProvider: DateProvider
let logoutUserUseCase: LogoutUserUseCase

// To test it user is being logout, it is needed to check if its refresh token is being deleted
describe('Logout User UseCase', () => {

    beforeEach(() => {
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        dateProvider = new DateProvider()
        logoutUserUseCase = new LogoutUserUseCase(tokensRepositoryInMemory)
    })

    // This test creates an user and a refresh token and then logout this user.
    // It is expected that refresh token does not exists after logout
    it('should be able to delete user\'s refresh token', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.refreshToken,
            value: 'a-valid-refresh-token',
            expiresDate: dateProvider.addDays(30),
            userId: user.id
        })

        await logoutUserUseCase.execute('a-valid-refresh-token')

        expect(tokensRepositoryInMemory.repository).toEqual([])
    })
})