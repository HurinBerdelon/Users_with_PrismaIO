import { Router } from "express";
import { ResetPasswordController } from "../modules/Users/useCases/resetPassword/resetPasswordController";
import { SendResetPasswordEmailController } from "../modules/Users/useCases/resetPassword/sendResetPasswordEmailController";

const passwordRoutes = Router()

const sendResetPasswordEmailController = new SendResetPasswordEmailController()
const resetPasswordController = new ResetPasswordController()

passwordRoutes.post('/reset', sendResetPasswordEmailController.handle)
passwordRoutes.patch('/reset', resetPasswordController.handle)

export { passwordRoutes }