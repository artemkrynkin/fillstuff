import { Router } from 'express';

import meRoutes from './me';

const usersRouter = Router();

usersRouter.use('/users', meRoutes);

export default usersRouter;
