import 'reflect-metadata'
import { AppError } from '../../../../../errors/AppError'
import { UsersRepositoryInMemory } from '../../../repositories/inMemory/UsersRepositoryInMemory'
import { UpdateUsernameUseCase } from './updateUsernameUseCase'

let usersRepositoryInMemory: UsersRepositoryInMemory
let updateUsernameUseCase: UpdateUsernameUseCase

// To test the UpdateUsername UseCase, it is needed just to check if username is being updated
// If the user exists before update the username
// If username is already in use for another account
describe('Update Username UseCase', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        updateUsernameUseCase = new UpdateUsernameUseCase(
            usersRepositoryInMemory
        )
    })

    // This tests creates an user in memory and update its username
    it('should be able to update user\'s username', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: 'password@test'
        })

        const new_username = 'NewUserName'

        const userUpdated = await updateUsernameUseCase.execute({
            user_id: user.id,
            username: new_username
        })

        expect(userUpdated.username).toEqual(new_username.toLowerCase())
    })

    // This test does not create an user in memory and tries to update the username of a non-existent user
    // It is expected an error to be thrown
    it('should not be able to update user\'s username if user does not exists', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: 'password@test'
        })

        await usersRepositoryInMemory.create({
            name: 'Another Name',
            email: 'email@another.com',
            username: 'AnotherUser',
            password: 'password@test'
        })

        await expect(
            updateUsernameUseCase.execute({
                user_id: user.id,
                username: 'AnotherUser'
            })
        ).rejects.toEqual(new AppError('Username already in user!', 401))
    })

    // This test create two user's and tries to update the username from one, to an existing username
    // An error should be thrown
    it('should not be able to update user\'s username if username is already in use', async () => {
        await expect(
            updateUsernameUseCase.execute({
                user_id: 'invalid-user-id',
                username: 'AnotherUser'
            })
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })
})