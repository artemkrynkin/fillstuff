import authRoutes from './auth';
import registration from './registration';
import account from './account';
import studio from './studio';
import members from './members';
import characteristics from './characteristics';
import shops from './shops';
import positions from './positions';
import positionGroups from './positionGroups';
import receipts from './receipts';
import writeOffs from './writeOffs';
import procurements from './procurements';
import invoices from './invoices';

const router = app => {
	app.use('/auth', authRoutes);
	app.use('/api', registration);
	app.use('/api', account);
	app.use('/api', studio);
	app.use('/api', members);
	app.use('/api', characteristics);
	app.use('/api', shops);
	app.use('/api', positions);
	app.use('/api', positionGroups);
	app.use('/api', receipts);
	app.use('/api', writeOffs);
	app.use('/api', procurements);
	app.use('/api', invoices);
};

export default router;
