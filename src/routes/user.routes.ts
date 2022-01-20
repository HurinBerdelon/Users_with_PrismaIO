import { Router } from "express";
import { CreateUserController } from "../modules/Users/useCases/createUser/createUserController";
import { DeleteUserController } from "../modules/Users/useCases/deleteUser/delete/deleteUserController";
import { SendDeleteEmailController } from "../modules/Users/useCases/deleteUser/sendDeleteMail/sendDeleteEmailController";

const userRoutes = Router()

const createUserController = new CreateUserController()
const sendDeleteEmailController = new SendDeleteEmailController()
const deleteUserController = new DeleteUserController()

userRoutes.post('', createUserController.handle)
userRoutes.post('/delete-account', sendDeleteEmailController.handle)
userRoutes.delete('/delete-account', deleteUserController.handle)

export { userRoutes }