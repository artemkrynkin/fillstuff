import { Router } from 'express';
import { createSigninRoutes } from './create-signin-routes';

const vkAuthRouter = Router();
const { main, callbacks } = createSigninRoutes('vkontakte', {});

vkAuthRouter.get('/', main);

vkAuthRouter.get('/callback', ...callbacks);

export default vkAuthRouter;
