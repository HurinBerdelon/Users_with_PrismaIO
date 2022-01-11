import { container } from "tsyringe";
import { UsersRepository } from "../../modules/Users/repositories/implementations/UsersRepository";
import { IUsersRepository } from "../../modules/Users/repositories/IUsersRepository";

// The index file of container folder has the responsibility of register each dependency that will be injected with decorators by tsyringe

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository
)