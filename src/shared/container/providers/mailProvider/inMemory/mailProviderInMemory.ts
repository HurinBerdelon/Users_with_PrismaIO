import { IMailProvider } from "../iMailProvider";

// This class has no real functionality, it is implemented just for running test without send any email

class MailProviderInMemory implements IMailProvider {

    private message: any[] = []

    // When called the sendMail method just save the information of the email that should be sent in a array in memory
    async sendMail(to: string, subject: string, variable: any, path: string): Promise<void> {
        this.message.push({
            to,
            subject,
            variable,
            path
        })
    }

}

export { MailProviderInMemory }