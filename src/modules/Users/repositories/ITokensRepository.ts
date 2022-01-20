import { Tokens } from "@prisma/client";
import { tokenType } from "../../../config/tokenType";
import { ICreateTokenDTO } from "../DTOs/ICreateTokenDTO";

// this interface types how TokensRepository should be implemented

interface ITokensRepository {
    create({ type, value, expiresDate, userId }: ICreateTokenDTO): Promise<void>
    findByTypeAndUserId(userId: string, type: tokenType): Promise<Tokens>
    findAllByUserId(userId: string): Promise<Tokens[]>
    findByToken(value: string): Promise<Tokens>
    delete(id: string): Promise<void>

}

export { ITokensRepository }