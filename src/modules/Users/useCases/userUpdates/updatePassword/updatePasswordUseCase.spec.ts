import { compare, hash } from 'bcrypt'
import 'reflect-metadata'
import { AppError } from '../../../../../errors/AppError'
import { UsersRepositoryInMemory } from '../../../repositories/inMemory/UsersRepositoryInMemory'
import { UpdatePasswordUseCase } from './updatePasswordUseCase'

let usersRepositoryInMemory: UsersRepositoryInMemory
let updatePasswordUseCase: UpdatePasswordUseCase

// To test the UpdatePassword UseCase, it is needed just to check:
// If password is being updated,
// If the user exists before update the name,
// If the old password is correctly passed
describe('Update Password UseCase', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        updatePasswordUseCase = new UpdatePasswordUseCase(
            usersRepositoryInMemory
        )
    })

    // This tests creates an user in memory and update its password
    it('should be able to update user\'s password', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await updatePasswordUseCase.execute({
            user_id: user.id,
            old_password: 'password@test',
            new_password: 'another@password'
        })

        const userUpdated = await usersRepositoryInMemory.findById(user.id)

        const passwordMatch = await compare('another@password', userUpdated.password)

        expect(passwordMatch).toEqual(true)
    })

    // This test does not create an user in memory and tries to update the password of a non-existent user
    // It is expected an error to be thrown
    it('should not be able to update user\'s password if user does not exists', async () => {
        await expect(
            updatePasswordUseCase.execute({
                user_id: 'invalid-user-id',
                new_password: 'new_password',
                old_password: 'old_password'
            })
        ).rejects.toEqual(new AppError('User not Found', 404))
    })

    // This tests creates an user in memory and tries to update its password confirming with a wrong password
    // It is expected an error to be thrown
    it('should not be able to update user\'s password if the old password received is incorrect', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: await hash('password@test', 8)
        })

        await expect(
            updatePasswordUseCase.execute({
                user_id: user.id,
                old_password: 'wrong@password',
                new_password: 'new@password'
            })
        ).rejects.toEqual(new AppError('Old Password is invalid', 401))
    })
})