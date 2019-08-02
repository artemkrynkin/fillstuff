import { Router } from 'express';

import membersRoutes from './members';
import stocksRoutes from './stocks';

const stocksRouter = Router();

stocksRouter.use('/stocks', membersRoutes);
stocksRouter.use('/stocks', stocksRoutes);

export default stocksRouter;
