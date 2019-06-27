import { Router } from 'express';
import localAuthRoutes from './local';
import logoutRoutes from './logout';

const authRouter = Router();

authRouter.use('/local', localAuthRoutes);
authRouter.use('/logout', logoutRoutes);

export default authRouter;
