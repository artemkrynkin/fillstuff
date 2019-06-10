import toobusy from 'toobusy-js';

// Middleware which blocks requests when the Node server is too busy
// now automatically retries the request at another instance of the server if it's too busy
export default (req, res, next) => {
	// Don't send 503s in testing, that's dumb, just wait it out
	if (process.env.NODE_ENV !== 'testing' && toobusy()) {
		res.statusCode = 503;
		res.end('It looks like Posterdate is very busy right now, please try again in a minute.');
	} else {
		next();
	}
};
