import 'reflect-metadata'
import { AppError } from '../../../../../errors/AppError'
import { UsersRepositoryInMemory } from '../../../repositories/inMemory/UsersRepositoryInMemory'
import { UpdateAvatarUseCase } from './updateAvatarUseCase'

let usersRepositoryInMemory: UsersRepositoryInMemory
let updateAvatarUseCase: UpdateAvatarUseCase

// To test the UpdateAvatar UseCase, it is needed just to check if avatar is being updated or created
// And if the user exists before update the name
describe('Update Avatar UseCase', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        updateAvatarUseCase = new UpdateAvatarUseCase(
            usersRepositoryInMemory
        )
    })

    // This test creates an user in memory and creates an avatar for this user
    it('should be able to create user\'s avatar', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: 'password@test'
        })

        const userUpdated = await updateAvatarUseCase.execute({
            user_id: user.id,
            avatar: 'pathForAvatar'
        })

        expect(userUpdated.avatar).toEqual('pathForAvatar')
    })

    // This test creates an user in memory, creates an avatar and then update the avatar
    it('should be able to update user\'s avatar', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: 'password@test'
        })

        await updateAvatarUseCase.execute({
            user_id: user.id,
            avatar: 'pathForAvatar'
        })

        const userUpdated = await updateAvatarUseCase.execute({
            user_id: user.id,
            avatar: 'new_pathForAvatar'
        })

        expect(userUpdated.avatar).toEqual('new_pathForAvatar')
    })

    // This test does not create an user in memory and tries to update the avatar of a non-existent user
    // It is expected an error to be thrown
    it('should not be able to update user\'s avatar if user does not exists', async () => {
        await expect(
            updateAvatarUseCase.execute({
                user_id: 'invalid-user-id',
                avatar: 'pathForAvatar'
            })
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })
})