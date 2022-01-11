import { Router } from "express";
import { CreateUserController } from "../modules/Users/useCases/createUser/createUserController";

const userRoutes = Router()

const createUserController = new CreateUserController()

userRoutes.post('', createUserController.handle)

export { userRoutes }