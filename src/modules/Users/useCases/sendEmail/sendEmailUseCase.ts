import { inject, injectable } from "tsyringe";
import { resolve } from 'path'
import { tokenType } from "../../../../config/tokenType";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/iMailProvider";
import { IJsonMessageDTO } from "../../DTOs/IJsonMessageDTO";
import { ITokensRepository } from "../../repositories/ITokensRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../errors/AppError";
import { User } from "@prisma/client";

// Type of the object received by execute method
interface IRequest {
    user_id?: string
    token: string
    token_type: tokenType
    email: string
    template: string
    emailSubject: string
    link: string
}

// There will be some cases in Users Registration and Updated that a e-mail will need to be sent to User
// So this class is responsible to Send those e-mails
@injectable()
class SendEmailUseCase {

    // The constructor Injects the dependecies this class will need, which are some providers and some repositories
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
        @inject('MailProvider')
        private mailProvider: IMailProvider
    ) { }

    async execute({ user_id, email, token, token_type, template, emailSubject, link }: IRequest): Promise<IJsonMessageDTO> {

        // templatePath uses resolve method from 'path' NodeJS module to parse the path where the HTML templates are stored
        const templatePath = resolve(__dirname, '..', '..', 'views', 'emails', template)

        // As the e-mail is going to be send to an user, we need to find it in userRepository
        let user: User

        // if the user_id is received, the user must be found by its ID
        // This allows sendMailUseCase to send an update email confirmation, because we can find the user by its ID,
        // but send a message to another e-mail, the one user desires to update to
        if (user_id) {
            user = await this.usersRepository.findById(user_id)
        } else {
            user = await this.usersRepository.findByEmail(email)
        }

        // An exception will be thrown if user is not found
        if (!user) {
            throw new AppError('User Not Found', 404)
        }

        // If the client tries to send a email to confirm an user's email and this user has its email already confirmed,
        // An expection is also thrown
        if (token_type === tokenType.confirmEmail && user.emailConfirmed) {
            throw new AppError('Email Already Confirmed')
        }

        // All the tokens sent by e-mail will have an expiration time of 3 hours
        // If user does not confirm the operation, it will be needed to send another e-mail 
        const expires_date = this.dateProvider.addHours(3)

        // If an old token for the same operation request already exists, it should be deleted, invalidating old tokens if 
        // new ones are requested
        const oldToken = await this.tokensRepository.findByTypeAndUserId(user.id, token_type)

        if (oldToken) {
            await this.tokensRepository.delete(oldToken.id)
        }

        await this.tokensRepository.create({
            userId: user.id,
            type: token_type,
            value: token,
            expiresDate: expires_date,
        })

        // this const defines the variables that will be parsed in the HTML template
        const variables = {
            name: user.name,
            link: `${link}${token}`
        }

        await this.mailProvider.sendMail(
            email,
            emailSubject,
            variables,
            templatePath
        )

        // After sending the email with sendMail method of mailProvider, a message confirming everything 
        // has gone right is returned
        return {
            message: `A link has been sent to ${email} to confirm your operation!`
        }
    }
}

export { SendEmailUseCase }