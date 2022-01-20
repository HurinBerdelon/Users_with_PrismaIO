import { PrismaClient, Tokens } from "@prisma/client";
import { tokenType } from "../../../../config/tokenType";
import { ICreateTokenDTO } from "../../DTOs/ICreateTokenDTO";
import { ITokensRepository } from "../ITokensRepository";

class TokensRepository implements ITokensRepository {

    private repository = new PrismaClient()

    async create({ type, value, expiresDate, userId }: ICreateTokenDTO): Promise<void> {

        await this.repository.tokens.create({
            data: {
                type,
                value,
                expiresAt: expiresDate,
                userId
            }
        })

    }

    // To find a information on the database we should find* methods of PrismaClient.Model, feeding it with the object
    // where and the attribute to filter the information. In this case it is being used findFirst method, to find by userId 
    // @unique and type (not unique). But as our business rules does not allow a user to have to tokens of the same type, the 
    // first value returned is going to be the only one in DB.
    async findByTypeAndUserId(userId: string, type: tokenType): Promise<Tokens> {
        const token = await this.repository.tokens.findFirst({
            where: {
                userId,
                type
            }
        })

        return token
    }

    // findMany method return an array of values with all the information with the criteria passed to "where attribute"
    async findAllByUserId(userId: string): Promise<Tokens[]> {
        const tokens = await this.repository.tokens.findMany({
            where: {
                userId
            }
        })

        return tokens
    }

    // findUnique method return only one value and the "where" attribute should receive and @unique or @id column of schema
    async findByToken(value: string): Promise<Tokens> {
        const token = await this.repository.tokens.findUnique({
            where: {
                value
            }
        })

        return token
    }
    // Delete method works similarly to findUnique, but instead of only bring the object, 
    // delete brings it and delete from the database
    async delete(id: string): Promise<void> {
        await this.repository.tokens.delete({
            where: {
                id
            }
        })
    }

}

export { TokensRepository }