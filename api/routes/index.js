import authRoutes from './auth';
import registration from './registration';
import account from './account';
import studio from './studio';
import members from './members';
import positions from './positions';
import positionGroups from './positionGroups';
import characteristics from './characteristics';
import writeOffs from './writeOffs';
import procurements from './procurements';

const router = app => {
	app.use('/auth', authRoutes);
	app.use('/api', registration);
	app.use('/api', account);
	app.use('/api', studio);
	app.use('/api', members);
	app.use('/api', positions);
	app.use('/api', positionGroups);
	app.use('/api', characteristics);
	app.use('/api', writeOffs);
	app.use('/api', procurements);
};

export default router;
