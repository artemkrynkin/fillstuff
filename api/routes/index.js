import characteristics from './characteristics';
import shops from './shops';
import positions from './positions';
import positionGroups from './positionGroups';
import receipts from './receipts';
import writeOffs from './writeOffs';
import procurements from './procurements';
import invoices from './invoices';
import storeNotifications from './storeNotifications';

const router = app => {
	app.use('/api', characteristics);
	app.use('/api', shops);
	app.use('/api', positions);
	app.use('/api', positionGroups);
	app.use('/api', receipts);
	app.use('/api', writeOffs);
	app.use('/api', procurements);
	app.use('/api', invoices);
	app.use('/api', storeNotifications);
};

export default router;
