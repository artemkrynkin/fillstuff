import { Router } from 'express';

import writeOffs from './writeOffs';

const writeOffsRouter = Router();

writeOffsRouter.use('/write-offs', writeOffs);

export default writeOffsRouter;
