import { hash } from "bcrypt";
import { container, inject, injectable } from "tsyringe";
import emailSubject from "../../../../config/emailSubject";
import envConfig from "../../../../config/envConfig";
import { tokenType } from "../../../../config/tokenType";
import { AppError } from "../../../../errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { ITokenProvider } from "../../../../shared/container/providers/generateToken/ITokenProvider";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/iMailProvider";
import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { IJsonMessageDTO } from "../../DTOs/IJsonMessageDTO";
import { IUserResponseDTO } from "../../DTOs/IUserResponseDTO";
import { UserMap } from "../../mapper/userMap";
import { ITokensRepository } from "../../repositories/ITokensRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { SendEmailUseCase } from "../sendEmail/sendEmailUseCase";

// UseCases are responsible for the main funcionality, using SOLID, they should be responsible for only one thing, in this case, to create the new user, indepent of the database (which is function of the repository) and the request/response (which is function of the controller)

// As tsyringe is being used to inject dependecies, we are using in the class of the useCase the decorator injectable (@injectable), to say this class can be injected (which is done in the controller) and we user decorator inject (@inject) to indicate which dependencies this class needs, in this case, the UsersRepository
@injectable()
class CreateUserUseCase {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('TokensRepository')
        private tokensRepository: ITokensRepository,
        @inject('TokenProvider')
        private tokenProvider: ITokenProvider,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
        @inject('MailProvider')
        private mailProvider: IMailProvider
    ) { }

    // as said before, using solid the class should have only one funcionality, so, there is only one function, which by default is called execute for all useCases.
    // here, execute method receives the information necessary to create the user, defined by the ICreateUserDTO interface.
    async execute({ name, username, email, password }: ICreateUserDTO): Promise<IJsonMessageDTO> {
        // It checks if user with the same email already exists, creating an exception if so.
        const userWithEmail = await this.usersRepository.findByEmail(email)

        if (userWithEmail) {
            throw new AppError(`User with e-mail ${email} already exists!`)
        }

        // It checks if user with the same username already exists, creating an exception if so.
        const userWithUsername = await this.usersRepository.findByUsername(username)

        if (userWithUsername) {
            throw new AppError(`User with username ${username} already exists!`)
        }

        // The password is encrypted. Passwords should NEVER be stored in the database as its real value. ALWAYS encrypt it
        const passwordHash = await hash(password, 8)

        // And then the user is created, calling the method create from the repository
        const user = await this.usersRepository.create({
            name,
            username,
            email,
            password: passwordHash
        })

        // SendMailUseCase is injected with container.resolve
        const sendMailUseCase = new SendEmailUseCase(
            this.usersRepository,
            this.tokensRepository,
            this.dateProvider,
            this.mailProvider
        )

        // And then called to send an e-mail to user, the response is a Json object, that you be returned to the controller
        const result = await sendMailUseCase.execute({
            email,
            token: await this.tokenProvider.confirmationToken(),
            token_type: tokenType.confirmEmail,
            emailSubject: emailSubject.confirmEmail,
            link: envConfig.confirmEmailURL,
            template: 'confirmRegistration.hbs'
        })

        // The result is returned, so the fron end can notify the User, that an e-mail has been sent
        return result
    }
}

export { CreateUserUseCase }