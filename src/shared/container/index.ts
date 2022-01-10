import { container } from "tsyringe";
import { UsersRepository } from "../../modules/Users/repositories/implementations/UsersRepository";
import { IUsersRepository } from "../../modules/Users/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository
)