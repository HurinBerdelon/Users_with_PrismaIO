import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import envConfig from '../config/envConfig'
import { AppError } from '../errors/AppError'
import { UsersRepository } from '../modules/Users/repositories/implementations/UsersRepository'

interface IPayload {
    sub: string
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    const authHeader = request.headers.authorization

    if (!authHeader) {
        throw new AppError('Token Missing', 401)
    }

    const [, accessToken] = authHeader.split(' ')

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
        throw new AppError('Invalid Token!', 401)
    }

}