import { Router } from "express";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { AuthenticateController } from "../modules/Users/useCases/authenticate/authenticateController";
import { LogoutUserControler } from "../modules/Users/useCases/logoutUser/logoutUserController";

const authenticateRoutes = Router()

const authenticateController = new AuthenticateController()
const logoutUserController = new LogoutUserControler()

authenticateRoutes.post('', authenticateController.handle)
authenticateRoutes.delete('/logout', ensureAuthenticated, logoutUserController.handle)

export { authenticateRoutes }