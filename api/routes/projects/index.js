import { Router } from 'express';

import membersRoutes from './members';
import projectsRoutes from './projects';
import socialPagesRoutes from './socialPages';
import topicsRoutes from './topics';

const usersRouter = Router();

usersRouter.use('/projects', membersRoutes);
usersRouter.use('/projects', projectsRoutes);
usersRouter.use('/projects', socialPagesRoutes);
usersRouter.use('/projects', topicsRoutes);

export default usersRouter;
