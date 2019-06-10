import { Router } from 'express';
import localAuthRoutes from './local';
import vkAuthRoutes from './vk';
import logoutRoutes from './logout';

const authRouter = Router();

authRouter.use('/local', localAuthRoutes);
authRouter.use('/vk', vkAuthRoutes);
authRouter.use('/logout', logoutRoutes);

export default authRouter;
