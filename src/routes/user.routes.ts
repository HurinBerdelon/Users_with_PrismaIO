import { Router } from "express";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { ConfirmEmailController } from "../modules/Users/useCases/confirmEmail/confirmEmailController";
import { CreateUserController } from "../modules/Users/useCases/createUser/createUserController";
import { DeleteUserController } from "../modules/Users/useCases/deleteUser/delete/deleteUserController";
import { SendDeleteEmailController } from "../modules/Users/useCases/deleteUser/sendDeleteMail/sendDeleteEmailController";
import { UpdateNameController } from "../modules/Users/useCases/userUpdates/updateName/updateNameController";
import { UpdatePasswordController } from "../modules/Users/useCases/userUpdates/updatePassword/updatePasswordController";
import { UpdateUsernameController } from "../modules/Users/useCases/userUpdates/updateUsername/updateUsernameController";

const userRoutes = Router()

const createUserController = new CreateUserController()
const confirmEmailController = new ConfirmEmailController()

const updateNameController = new UpdateNameController()
const updateUsernameController = new UpdateUsernameController()
const updatePasswordController = new UpdatePasswordController()

const sendDeleteEmailController = new SendDeleteEmailController()
const deleteUserController = new DeleteUserController()


userRoutes.post('', createUserController.handle)
userRoutes.patch('/confirm-email', confirmEmailController.handle)

userRoutes.patch('/update-name', ensureAuthenticated, updateNameController.handle)
userRoutes.patch('/update-username', ensureAuthenticated, updateUsernameController.handle)
userRoutes.patch('/update-password', ensureAuthenticated, updatePasswordController.handle)

userRoutes.post('/delete-account', ensureAuthenticated, sendDeleteEmailController.handle)
userRoutes.delete('/delete-account', ensureAuthenticated, deleteUserController.handle)

export { userRoutes }