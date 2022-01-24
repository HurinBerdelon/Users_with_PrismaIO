import 'reflect-metadata'
import { AppError } from '../../../../errors/AppError'
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory'
import { UpdateNameUseCase } from './updateNameUseCase'

let usersRepositoryInMemory: UsersRepositoryInMemory
let updateNameUseCase: UpdateNameUseCase

// To test the UpdateName UseCase, it is needed just to check if name is being updated
// And if the user exists before update the name
describe('Update Name Use Case', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        updateNameUseCase = new UpdateNameUseCase(usersRepositoryInMemory)
    })

    // This tests creates an user in memory and update its name
    it('should be able to uptade user\'s name', async () => {
        const user = await usersRepositoryInMemory.create({
            name: 'Name Test',
            email: 'email@test.com',
            username: 'UserTest',
            password: 'password@test'
        })

        const userUpdated = await updateNameUseCase.execute({
            user_id: user.id,
            name: 'New Name Test'
        })

        expect(userUpdated.name).toEqual('New Name Test')
    })

    // This test does not create an user in memory and tries to update the name of a non-existent user
    // It is expected an error to be thrown
    it('should not be able to uptade user\'s name if user does not exists', async () => {
        await expect(
            updateNameUseCase.execute({
                user_id: 'invalid_user_id',
                name: 'New Name Test'
            })
        ).rejects.toEqual(new AppError('User not Found!', 404))
    })
})