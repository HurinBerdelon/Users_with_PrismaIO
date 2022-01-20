import fs from 'fs'
import Handlebars, { template } from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'tsyringe';
import { IMailProvider } from '../iMailProvider';

// When developing it is normally used a test email sender, nodemailer provides it with ethereal main server

@injectable()
class EtherealMailProvider implements IMailProvider {

    private client: Transporter

    // The constructor of the class create the Test Account and the Transporter from Nodemailer
    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })

            this.client = transporter
        }).catch(err => console.log(err))
    }

    // sendMail method receive informations about the email that should be sent, converts the template
    // on a string with file system method readFileSync, then it is compiled in a Handlebars template
    // and then parsed with the variables that should complete the template.
    // Finally, the sendMail method of the transporter is called to send the email.
    async sendMail(to: string, subject: string, variable: any, path: string): Promise<void> {

        const templateFileContent = fs.readFileSync(path).toString('utf-8')

        const templateParse = Handlebars.compile(templateFileContent)

        const templateHTML = templateParse(variable)

        const message = await this.client.sendMail({
            to,
            from: process.env.EMAIL_SENDER,
            subject,
            html: templateHTML
        })

        // The link to access the test email server is logged on console, so the developer could access it.
        console.log(`Message Sent: ${message.messageId}`)
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)
    }

}

export { EtherealMailProvider }