import { v4 as uuidv4 } from 'uuid'

import { Tokens } from "@prisma/client";
import { tokenType } from "../../../../config/tokenType";
import { ICreateTokenDTO } from "../../DTOs/ICreateTokenDTO";
import { ITokensRepository } from "../ITokensRepository";
import { container } from 'tsyringe';
import { DateProvider } from '../../../../shared/container/providers/dateProvider/implementations/DateProvider';

const dateProvider = container.resolve(DateProvider)

// It's a good practice to have a InMemory Repository to implement unitary tests on this repository, no compromising the real database
// It's a mirror of the real Repository, but here we store information in an array in memory and use array methods and attributes, instead of connect to the database with prisma

class TokensRepositoryInMemory implements ITokensRepository {

    // Declaration of the array object, as an empty array of type Tokens (the model created in schema.prisma)
    repository: Tokens[] = []

    // To create a object here, we simply create it and push into the array, this function doesn't need to be assynchronous, but it's defined this way, because it's implementing the interface of the real repository, so it becomes a mirror repository
    async create({ type, value, expiresDate, userId }: ICreateTokenDTO): Promise<void> {
        const token: Tokens = {
            id: uuidv4(),
            type,
            value,
            userId,
            expiresAt: expiresDate,
            createdAt: dateProvider.dateNow()
        }

        this.repository.push(token)
    }

    // to find an object in an array, we iterate in the array and return the object that matchs the condition of iteration
    async findByTypeAndUserId(userId: string, type: tokenType): Promise<Tokens> {
        const token = this.repository.find((token) => {
            token.userId === userId &&
                token.type === type
            return token
        })

        return token
    }

    async findAllByUserId(userId: string): Promise<Tokens[]> {
        const tokens = this.repository.filter(token => token.userId === userId)

        return tokens
    }

    async findByToken(value: string): Promise<Tokens> {
        const token = this.repository.find(token => token.value === value)

        return token
    }

    // to delete a object of the array, we first find this object and pass its index for the splice array method
    async delete(id: string): Promise<void> {
        const token = this.repository.find(token => token.id === id)

        this.repository.splice(this.repository.indexOf(token))
    }

}

export { TokensRepositoryInMemory }