import { tokenType } from "../../../config/tokenType";

interface IAuthenticateUserDTO {
    user: {
        name: string
        username: string
        email: string
    },
    accessToken: string,
    refreshToken: string
}

export { IAuthenticateUserDTO }