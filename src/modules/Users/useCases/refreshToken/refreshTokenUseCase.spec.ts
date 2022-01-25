import 'reflect-metadata'
import { hash } from 'bcrypt'
import { DateProvider } from '../../../../shared/container/providers/dateProvider/implementations/DateProvider'
import { TokenProvider } from '../../../../shared/container/providers/generateToken/implementations/TokenProvider'
import { TokensRepositoryInMemory } from '../../repositories/inMemory/ItokensRepositoryInMemory'
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory'
import { RefreshTokenUseCase } from './refreshTokenUseCase'
import { tokenType } from '../../../../config/tokenType'
import { AppError } from '../../../../errors/AppError'

let usersRepositoryInMemory: UsersRepositoryInMemory
let tokensRepositoryInMemory: TokensRepositoryInMemory
let tokenProvider: TokenProvider
let dateProvider: DateProvider
let refreshTokenUseCase: RefreshTokenUseCase

// To test refreshToken UseCase it is needed to check:
// If the refreshToken is valid and not expired, throwing an exception otherwise,
// If user still exists, throwing an error if not,
// Create a new refreshToken and a new accessToken and return it
describe('RefreshToken UseCase', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        tokensRepositoryInMemory = new TokensRepositoryInMemory()
        tokenProvider = new TokenProvider()
        dateProvider = new DateProvider()
        refreshTokenUseCase = new RefreshTokenUseCase(
            usersRepositoryInMemory,
            tokensRepositoryInMemory,
            tokenProvider,
            dateProvider
        )
    })

    // This test creates an user and a refreshToken
    // Then call refreshToken UseCase, it is expected that return from UseCase
    // has properties user, accessToken and refreshToken
    it('should be able to refresh User\'s access Token', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.refreshToken,
            value: 'a-refresh-token',
            expiresDate: dateProvider.addDays(30),
            userId: user.id
        })

        const result = await refreshTokenUseCase.execute('a-refresh-token')

        expect(result).toHaveProperty('user')
        expect(result).toHaveProperty('accessToken')
        expect(result).toHaveProperty('refreshToken')
    })

    // This test tries to refreshToken with an invalid refreshToken,
    // It is expected an error to be thrown
    it('should not be able to refresh User\'s access Token if refresh token is invalid', async () => {
        await expect(
            refreshTokenUseCase.execute('invalid-refresh-token')
        ).rejects.toEqual(new AppError('Invalid Token!', 401))
    })

    // This test tries to refreshToken with an expired, but valid refreshToken
    // It is expected an error to be thrown
    it('should not be able to refresh User\'s access Token if refresh token is expired', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await tokensRepositoryInMemory.create({
            type: tokenType.refreshToken,
            value: 'a-refresh-token',
            expiresDate: dateProvider.addDays(-30),
            userId: user.id
        })

        await expect(
            refreshTokenUseCase.execute('a-refresh-token')
        ).rejects.toEqual(new AppError('Token has expired!', 401))
    })

    // This test tries to refreshToken of an inexistend user
    // It is expected an error to be thrown
    it('should not be able to refresh User\'s access Token if user no longer exists', async () => {
        await tokensRepositoryInMemory.create({
            type: tokenType.refreshToken,
            value: 'a-refresh-token',
            expiresDate: dateProvider.addDays(30),
            userId: 'invalid-user-id'
        })

        await expect(
            refreshTokenUseCase.execute('a-refresh-token')
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })
})