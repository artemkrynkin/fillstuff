import { Router } from 'express';
import received from './received';
import expected from './expected';

const procurementsRouter = Router();

procurementsRouter.use('/', received);
procurementsRouter.use('/', expected);

export default procurementsRouter;
