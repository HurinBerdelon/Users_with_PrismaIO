import { Router } from "express";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { AuthenticateController } from "../modules/Users/useCases/authenticate/authenticateController";
import { LogoutUserControler } from "../modules/Users/useCases/logoutUser/logoutUserController";
import { RefreshTokenController } from "../modules/Users/useCases/refreshToken/refreshTokenController";

const authenticateRoutes = Router()

const authenticateController = new AuthenticateController()
const logoutUserController = new LogoutUserControler()
const refreshTokenController = new RefreshTokenController()

authenticateRoutes.post('', authenticateController.handle)
authenticateRoutes.post('/refresh', refreshTokenController.handle)
authenticateRoutes.delete('/logout', ensureAuthenticated, logoutUserController.handle)

export { authenticateRoutes }