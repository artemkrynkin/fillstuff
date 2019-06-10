// TODO: разобраться с этим файлом
// Redirect any route ?thread=<id> to /thread/<id>

const threadParamRedirect = (req, res, next) => {
	// Redirect /?t=asdf123 if the user isn't logged in
	if (req.query.t && !req.user) {
		if (req.query.m) {
			res.redirect(`/projects/${req.query.t}?m=${req.query.m}`);
		}
		res.redirect(`/projects/${req.query.t}`);
		// Redirect /anything?thread=asdf123
	} else if (req.query.thread) {
		if (req.query.m) {
			res.redirect(`/projects/${req.query.thread}?m=${req.query.m}`);
		}
		res.redirect(`/projects/${req.query.thread}`);
	} else {
		next();
	}
};

export default threadParamRedirect;
