// Type of tokens saved in Database

enum tokenType {
    accessToken = 'AccessToken',
    confirmEmail = 'ConfirmEmail',
    refreshToken = 'RefreshToken',
    recoverPassword = 'RecoverPassword',
    deleteUser = 'DeleteUser'
}

export { tokenType }