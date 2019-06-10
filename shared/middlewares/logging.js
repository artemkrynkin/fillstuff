const debug = require('debug')('shared:middlewares:logging');

module.exports = (req, res, next) => {
	debug(`requesting (${req.method}) ${req.url}`);
	next();
};
