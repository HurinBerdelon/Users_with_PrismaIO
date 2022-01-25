import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { passwordRoutes } from "./password.routes";

const router = Router()

router.use('/user', userRoutes)
router.use('/session', authenticateRoutes)
router.use('/password', passwordRoutes)

export { router }