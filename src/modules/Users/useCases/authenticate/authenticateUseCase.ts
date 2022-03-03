import { inject, injectable } from "tsyringe";
import *  as EmailValidator from 'email-validator'
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { ITokenProvider } from "../../../../shared/container/providers/generateToken/ITokenProvider";
import { IAuthenticateUserDTO } from "../../DTOs/IAuthenticateUserDTO";
import { ITokensRepository } from "../../repositories/ITokensRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/iMailProvider";
import { User } from "@prisma/client";
import { AppError } from "../../../../errors/AppError";
import { compare } from "bcrypt";
import { SendEmailUseCase } from "../sendEmail/sendEmailUseCase";
import { tokenType } from "../../../../config/tokenType";
import emailSubject from "../../../../config/emailSubject";
import envConfig from "../../../../config/envConfig";

interface IRequest {
    login: string
    password: string
}

@injectable()
class AuthenticateUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
        @inject('TokenProvider')
        private tokenProvider: ITokenProvider,
        @inject('MailProvider')
        private mailProvider: IMailProvider
    ) { }

    async execute({ login, password }: IRequest): Promise<IAuthenticateUserDTO> {

        let user: User

        const loginIsEmail = EmailValidator.validate(login)

        if (loginIsEmail) {
            user = await this.usersRepository.findByEmail(login)

            if (!user) {
                throw new AppError('Login or Password incorrect!', 401)
            }
        } else {
            user = await this.usersRepository.findByUsername(login)

            if (!user) {
                throw new AppError('Login or Password incorrect!', 401)
            }
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new AppError('Login or Password incorrect!', 401)
        }

        if (!user.emailConfirmed) {
            const sendEmailUseCase = new SendEmailUseCase(
                this.usersRepository,
                this.tokensRepository,
                this.dateProvider,
                this.mailProvider
            )

            await sendEmailUseCase.execute({
                email: user.email,
                token: await this.tokenProvider.confirmationToken(),
                token_type: tokenType.confirmEmail,
                emailSubject: emailSubject.confirmEmail,
                link: envConfig.confirmEmailURL,
                template: 'confirmRegistration.hbs'
            })

            throw new AppError(`A link has been sent to ${user.email} to confirm your registration!`)
        }

        const accessToken = await this.tokenProvider.accessToken(user.id)
        const refreshToken = await this.tokenProvider.refreshToken()

        await this.tokensRepository.create({
            type: tokenType.refreshToken,
            value: refreshToken,
            expiresDate: this.dateProvider.addDays(Number(envConfig.Refresh_Token_Expiration)),
            userId: user.id
        })

        return {
            user: {
                name: user.name,
                username: user.username,
                email: user.email
            },
            accessToken,
            refreshToken
        }
    }
}

export { AuthenticateUseCase }