import authRoutes from './auth';
import authSocialRoutes from './auth/social';
import registration from './registration';
import users from './users';
import projects from './projects';

const router = app => {
	app.use('/auth', authRoutes);
	app.use('/auth-social', authSocialRoutes);
	app.use('/api', registration);
	app.use('/api', users);
	app.use('/api', projects);
};

export default router;
