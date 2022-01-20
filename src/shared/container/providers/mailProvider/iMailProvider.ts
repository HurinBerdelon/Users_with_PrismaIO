// Interface to type how the Mail Provider should be implemented

interface IMailProvider {
    sendMail(
        to: string,
        subject: string,
        variable: any,
        path: string
    ): Promise<void>
}

export { IMailProvider }