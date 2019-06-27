import { Router } from 'express';

import productsRoutes from './products';

const productsRouter = Router();

productsRouter.use('/products', productsRoutes);

export default productsRouter;
