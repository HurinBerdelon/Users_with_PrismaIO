import { User } from '@prisma/client'
import { instanceToInstance } from 'class-transformer'
import { IUserResponseDTO } from '../DTOs/IUserResponseDTO'

// A mapper has the function of convert data objects
// As the object of User, from prisma contains all information of its columns, and it means to contain sensible informations, as the password, we should use a mapper, to pass only the information necessery on response object
class UserMap {

    static toDTO({
        id,
        name,
        email,
        username,
        avatar
    }: User): IUserResponseDTO {
        const user = instanceToInstance({
            id,
            name,
            email,
            username,
            avatar
        })

        return user
    }
}

export { UserMap }