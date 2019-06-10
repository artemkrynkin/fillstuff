import { Router } from 'express';

const IS_PROD = process.env.NODE_ENV === 'production';
const HOME = IS_PROD ? '/login' : 'http://localhost:3000/login';
const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
	req.logOut();
	res.redirect(HOME);
});

export default logoutRouter;
