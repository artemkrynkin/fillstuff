import authRoutes from './auth';
import registration from './registration';
import users from './users';
import stocks from './stocks';
import positions from './positions';
import positionGroups from './positionGroups';
import characteristics from './characteristics';
import writeOffs from './writeOffs';
import other from './other';

const router = app => {
	app.use('/auth', authRoutes);
	app.use('/api', registration);
	app.use('/api', users);
	app.use('/api', stocks);
	app.use('/api', positions);
	app.use('/api', positionGroups);
	app.use('/api', characteristics);
	app.use('/api', writeOffs);
	app.use('/api', other);
};

export default router;
