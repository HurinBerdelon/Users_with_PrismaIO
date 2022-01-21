import { Router } from "express";
import { AuthenticateController } from "../modules/Users/useCases/authenticate/authenticateController";

const authenticateRoutes = Router()

const authenticateController = new AuthenticateController()

authenticateRoutes.post('', authenticateController.handle)

export { authenticateRoutes }