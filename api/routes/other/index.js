import { Router } from 'express';
import request from 'request';

import { isAuthedResolver } from 'api/utils/permissions';

const otherRouter = Router();

// const debug = require('debug')('api:products');

otherRouter.get('/scraping', isAuthedResolver, (req, res, next) => {
	const { url } = req.query;

	// request(!~url.search(/^http[s]?\:\/\//) ? `http://${url}` : url, function(err, res, body) {
	//   console.log(err);
	// });
});

export default otherRouter;
