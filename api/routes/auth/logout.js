import { Router } from 'express';

import Emitter from 'api/utils/emitter';

const IS_PROD = process.env.NODE_ENV === 'production';
const HOME = IS_PROD ? '/login' : 'http://localhost:3000/login';

const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
	const sid = req.session.id;

	req.session.destroy(() => {
		Emitter.emit('session:reload', sid);
		res.redirect(HOME);
	});
});

export default logoutRouter;
