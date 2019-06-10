export const updateCookieUserData = (req, data) => {
	return new Promise((resolve, reject) => {
		req.login(data, err => (err ? reject(err) : resolve()));
	});
};
