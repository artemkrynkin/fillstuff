import { Router } from 'express';

import membersRoutes from './members';
import stocksRoutes from './stocks';
import categoriesRoutes from './categories';

const usersRouter = Router();

usersRouter.use('/stocks', membersRoutes);
usersRouter.use('/stocks', stocksRoutes);
usersRouter.use('/stocks', categoriesRoutes);

export default usersRouter;
