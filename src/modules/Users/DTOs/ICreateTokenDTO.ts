import { tokenType } from "../../../config/tokenType";

interface ICreateTokenDTO {
    value: string,
    type: tokenType,
    userId: string,
    expiresDate: Date
}

export { ICreateTokenDTO }