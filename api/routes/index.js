import authRoutes from './auth';
import registration from './registration';
import users from './users';
import stocks from './stocks';
import products from './products';
import markers from './markers';
import manufacturers from './manufacturers';
import specifications from './specifications';
import writeOffs from './writeOffs';

const router = app => {
	app.use('/auth', authRoutes);
	app.use('/api', registration);
	app.use('/api', users);
	app.use('/api', stocks);
	app.use('/api', products);
	app.use('/api', markers);
	app.use('/api', manufacturers);
	app.use('/api', specifications);
	app.use('/api', writeOffs);
};

export default router;
