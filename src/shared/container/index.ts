import { container } from "tsyringe";
import { TokensRepository } from "../../modules/Users/repositories/implementations/TokensRepository";
import { UsersRepository } from "../../modules/Users/repositories/implementations/UsersRepository";
import { ITokensRepository } from "../../modules/Users/repositories/ITokensRepository";
import { IUsersRepository } from "../../modules/Users/repositories/IUsersRepository";

import './providers'

// The index file of container folder has the responsibility of register each dependency that will
// be injected with decorators by tsyringe

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository
)

container.registerSingleton<ITokensRepository>(
    'TokensRepository',
    TokensRepository
)