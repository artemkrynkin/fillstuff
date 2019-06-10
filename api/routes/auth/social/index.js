import { Router } from 'express';
import vkSocialRoutes from './vk';

const authSocialRoutes = Router();

authSocialRoutes.use('/vk', vkSocialRoutes);

export default authSocialRoutes;
