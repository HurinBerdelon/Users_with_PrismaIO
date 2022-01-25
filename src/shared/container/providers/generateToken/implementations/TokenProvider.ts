import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid'
import envConfig from '../../../../../config/envConfig';
import { ITokenProvider } from "../ITokenProvider";

// TokenProvider has the responsibilty to generate the tokens used in the application
// This class follows the type defined by ITokenProvider interface
@injectable()
class TokenProvider implements ITokenProvider {

    // AccessToken is a Json Web Token, with a small expiration, so the user does not stay connected for so long,
    // without refreshing its accessToken
    async accessToken(userId: string): Promise<string> {
        const token = sign({}, envConfig.JWT_SECRET, {
            subject: userId,
            expiresIn: envConfig.JWT_EXPIRATION
        })

        return token
    }

    // RefreshToken is a hash from a uuid and is used to keep using connected updating its accessToken
    async refreshToken(): Promise<string> {
        return await hash(uuidv4(), 8)
    }

    // ConfirmationToken and recoverPasswordToken are uuids tokens, sent by email just to confirm that
    // user is owner of the email and to confirm that the real user is requesting password recover
    async confirmationToken(): Promise<string> {
        return uuidv4()
    }

    async recoverPasswordToken(): Promise<string> {
        return uuidv4()
    }

    // changeEmailToken has a concatenation with the email in the uuid, so when receiving this token back,
    // when user click on the link sent by email, the backend can parse the email and updating it in database
    async changeEmailToken(email: string): Promise<string> {

        return `${uuidv4()}#_!${email}`
    }

}

export { TokenProvider }