export const getItemFromCookies = key => {
	if (!document.cookie) return;

	try {
		let matches = document.cookie.match(
			new RegExp(
				// eslint-disable-next-line
				'(?:^|; )' + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
			)
		);
		return matches ? decodeURIComponent(matches[1]) : null;
	} catch (err) {
		console.error(`Error getting item ${key} from Cookies`, err);
	}
};

export const storeItem = (key, item, options) => {
	if (!document.cookie) return;

	try {
		options = options || {};

		let expires = options.expires;

		if (typeof expires == 'number' && expires) {
			let d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}

		item = encodeURIComponent(item);

		let updatedCookie = key + '=' + item;

		for (let propKey in options) {
			updatedCookie += '; ' + propKey;
			let propItem = options[propKey];
			if (propItem !== true) {
				updatedCookie += '=' + propItem;
			}
		}

		document.cookie = updatedCookie;

		return document.cookie;
	} catch (err) {
		console.error(`Error storing item ${key} to Cookies`, err);
	}
};

export const removeItemFromCookies = key => {
	if (!document.cookie) return;

	try {
		storeItem(key, '', {
			expires: -1,
		});
	} catch (err) {
		console.error(`Error removing item ${key} from Cookies`, err);
	}
};
