import 'dotenv/config'

// Importing environmental variables to use as in memory variables.
// This file has this only responsibilty, so the other API files does not need to have this responsability

export default {
    // Email configs from environmental variables
    mailProvider: process.env.MAIL,
    recoverEmailURL: process.env.RECOVER_PASSWORD_MAIL_URL,
    confirmEmailURL: process.env.CONFIRM_EMAIL_URL,
    deleteUserEMAILURL: process.env.CONFIRM_DELETE_USER_URL,

    // JWT configs
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION
}