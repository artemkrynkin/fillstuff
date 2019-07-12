import { Router } from 'express';

import membersRoutes from './members';
import stocksRoutes from './stocks';
import productShopsRouter from './productShops';
import productSpecificationsRouter from './productSpecifications';

const stocksRouter = Router();

stocksRouter.use('/stocks', membersRoutes);
stocksRouter.use('/stocks', stocksRoutes);
stocksRouter.use('/stocks', productShopsRouter);
stocksRouter.use('/stocks', productSpecificationsRouter);

export default stocksRouter;
