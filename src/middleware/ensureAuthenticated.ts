import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import envConfig from '../config/envConfig'
import { AppError } from '../errors/AppError'
import { UsersRepository } from '../modules/Users/repositories/implementations/UsersRepository'

// interface to type JWT token
interface IPayload {
    sub: string
}

// middleware function to ensure user is authenticated,
// middleware with express should receive request, response and nextfunction objects from express
export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    // Receives and checks if there is a token in the request headers
    const authHeader = request.headers.authorization

    if (!authHeader) {
        throw new AppError('Token Missing', 401)
    }

    // The token is passed as Bearer string, so it is needed to split the token from the 'Bearer ' string
    const [, accessToken] = authHeader.split(' ')

    // With the token, the user_id is extracted, user is searched in the usersRepository and then its Id is inserted
    // as an attribute in the request object.
    // Finally next() function is called, to say that the process can keep running
    try {
        const { sub: user_id } = verify(accessToken, envConfig.JWT_SECRET) as IPayload

        const usersRepository = new UsersRepository()
        const user = await usersRepository.findById(user_id)

        if (!user) {
            throw new AppError('User not Found!', 404)
        }

        request.user = {
            id: user_id
        }

        next()

    } catch {
        // If some error occur, an exception is thrown
        throw new AppError('Invalid Token!', 401)
    }

}