import 'reflect-metadata'
import { tokenType } from "../../../../config/tokenType"
import { AppError } from '../../../../errors/AppError'
import { DateProvider } from "../../../../shared/container/providers/dateProvider/implementations/DateProvider"
import { MailProviderInMemory } from "../../../../shared/container/providers/mailProvider/inMemory/mailProviderInMemory"
import { TokensRepositoryInMemory } from "../../repositories/inMemory/ItokensRepositoryInMemory"
import { UsersRepositoryInMemory } from "../../repositories/inMemory/UsersRepositoryInMemory"
import { SendEmailUseCase } from "./sendEmailUseCase"

// Defines variables to be user later
let usersRepository: UsersRepositoryInMemory
let tokensRepository: TokensRepositoryInMemory
let dateProvider: DateProvider
let mailProvider: MailProviderInMemory
let sendMailUseCase: SendEmailUseCase

// This files runs tests to cover Send Mail Use Case functionalities and excpetions
describe('Send Mail Use Case', () => {

    // Before each test, all the repositories, providers and Use Case are initialized
    // As all of it runs in memory, it is a good practice to not have garbage on memory 
    // on running each test
    beforeEach(() => {
        usersRepository = new UsersRepositoryInMemory()
        tokensRepository = new TokensRepositoryInMemory()
        dateProvider = new DateProvider()
        mailProvider = new MailProviderInMemory()
        sendMailUseCase = new SendEmailUseCase(
            usersRepository,
            tokensRepository,
            dateProvider,
            mailProvider
        )
    })

    // Before send an email, a token need to be created, this test is responsible to check it
    it('should be able to create a token', async () => {
        const user = await usersRepository.create({
            name: 'Name test',
            email: 'email@test.com',
            username: 'UserName',
            password: 'password@test'
        })

        await sendMailUseCase.execute({
            email: user.email,
            emailSubject: 'Email Subject | Test',
            link: 'http://localhost:3030',
            template: 'template.hbs',
            token: 'valid-token',
            token_type: tokenType.recoverPassword
        })

        const tokenCreated = await tokensRepository.findByToken('valid-token')

        expect(tokenCreated).toHaveProperty('id')
        expect(tokenCreated).toHaveProperty('expiresAt')
    })

    // After checking if a token was created, a e-mail should be sent, and this test is responsible for that
    // mailProviderInMemory does not send a real e-mail, so here is used Jest SpyOn functionality to check if
    // sendMail method is been Called
    it('should be able to send an e-mail', async () => {
        const sendMail = jest.spyOn(mailProvider, 'sendMail')

        const user = await usersRepository.create({
            name: 'Name test',
            email: 'email@test.com',
            username: 'UserName',
            password: 'password@test'
        })

        await sendMailUseCase.execute({
            email: user.email,
            emailSubject: 'Email Subject | Test',
            link: 'http://localhost:3030',
            template: 'template.hbs',
            token: 'valid-token',
            token_type: tokenType.recoverPassword
        })

        expect(sendMail).toHaveBeenCalled()
    })

    // If an user does not exists, an e-mail should not be sent to its email, this test
    // checks if user exists
    it('should not be able to send e-mail if user does not exist', async () => {
        await expect(sendMailUseCase.execute({
            email: 'invalid-user-id',
            emailSubject: 'Email Subject | Test',
            link: 'http://localhost:3030',
            template: 'template.hbs',
            token: 'valid-token',
            token_type: tokenType.recoverPassword
        })
        ).rejects.toEqual(new AppError('User Not Found', 404))
    })

    // If the client is trying to confirm an email already confirmed, an excpection should be thrwon
    // In this test it is checked
    it('should not be able to send a confirmation e-mail if email is already confirmed', async () => {
        const user = await usersRepository.create({
            name: 'Name test',
            email: 'email@test.com',
            username: 'UserName',
            password: 'password@test'
        })

        await usersRepository.confirmEmail(user.email)

        await expect(sendMailUseCase.execute({
            email: user.email,
            emailSubject: 'Email Subject | Test',
            link: 'http://localhost:3030',
            template: 'template.hbs',
            token: 'valid-token',
            token_type: tokenType.confirmEmail
        })
        ).rejects.toEqual(new AppError('Email Already Confirmed'))
    })
})