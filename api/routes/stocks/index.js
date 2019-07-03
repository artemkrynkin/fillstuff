import { Router } from 'express';

import membersRoutes from './members';
import stocksRoutes from './stocks';
import categoriesRoutes from './categories';
import productSpecificationsRouter from './productSpecifications';

const stocksRouter = Router();

stocksRouter.use('/stocks', membersRoutes);
stocksRouter.use('/stocks', stocksRoutes);
stocksRouter.use('/stocks', categoriesRoutes);
stocksRouter.use('/stocks', productSpecificationsRouter);

export default stocksRouter;
