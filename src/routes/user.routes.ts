import { Router } from "express";
import multer from 'multer'
import uploadConfig from "../config/upload";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { ConfirmEmailController } from "../modules/Users/useCases/confirmEmail/confirmEmailController";
import { CreateUserController } from "../modules/Users/useCases/createUser/createUserController";
import { DeleteUserController } from "../modules/Users/useCases/deleteUser/delete/deleteUserController";
import { SendDeleteEmailController } from "../modules/Users/useCases/deleteUser/sendDeleteMail/sendDeleteEmailController";
import { UpdateAvatarController } from "../modules/Users/useCases/userUpdates/updateAvatar/updateAvatarController";
import { SendUpdateEmailController } from "../modules/Users/useCases/userUpdates/updateEmail/sendUpdateEmailController";
import { UpdateEmailController } from "../modules/Users/useCases/userUpdates/updateEmail/updateEmailController";
import { UpdateNameController } from "../modules/Users/useCases/userUpdates/updateName/updateNameController";
import { UpdatePasswordController } from "../modules/Users/useCases/userUpdates/updatePassword/updatePasswordController";
import { UpdateUsernameController } from "../modules/Users/useCases/userUpdates/updateUsername/updateUsernameController";

const userRoutes = Router()

const uploadAvatar = multer(uploadConfig.upload('./tmp/avatar'))

const createUserController = new CreateUserController()
const confirmEmailController = new ConfirmEmailController()

const updateNameController = new UpdateNameController()
const updateUsernameController = new UpdateUsernameController()
const updatePasswordController = new UpdatePasswordController()
const updateAvatarController = new UpdateAvatarController()
const sendUpdateEmailController = new SendUpdateEmailController()
const updateEmailController = new UpdateEmailController()

const sendDeleteEmailController = new SendDeleteEmailController()
const deleteUserController = new DeleteUserController()


userRoutes.post('', createUserController.handle)
userRoutes.patch('/confirm-email', confirmEmailController.handle)

userRoutes.patch('/update-name', ensureAuthenticated, updateNameController.handle)
userRoutes.patch('/update-username', ensureAuthenticated, updateUsernameController.handle)
userRoutes.patch('/update-password', ensureAuthenticated, updatePasswordController.handle)
userRoutes.post('/update-email', ensureAuthenticated, sendUpdateEmailController.handle)
userRoutes.patch('/update-email', ensureAuthenticated, updateEmailController.handle)

userRoutes.patch('/update-avatar',
    ensureAuthenticated,
    uploadAvatar.single('avatar'),
    updateAvatarController.handle,
)

userRoutes.post('/delete-account', ensureAuthenticated, sendDeleteEmailController.handle)
userRoutes.delete('/delete-account', ensureAuthenticated, deleteUserController.handle)

export { userRoutes }