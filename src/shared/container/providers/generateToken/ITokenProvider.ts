// Interface to type how the Token Provider should be implemented

interface ITokenProvider {
    accessToken(userId: string): Promise<string>
    refreshToken(): Promise<string>
    confirmationToken(): Promise<string>
    recoverPasswordToken(): Promise<string>
    changeEmailToken(email: string): Promise<string>
}

export { ITokenProvider }