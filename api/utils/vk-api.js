import request from 'request';

// Node-vkapi посмотреть при выполнении #31 задачи
export const vkApi = (method, accessToken, options) => {
	return new Promise((resolve, reject) => {
		const initialOptions = {
			v: 5.92,
			access_token: accessToken,
		};

		const searchParams = new Map();

		for (let key in initialOptions) searchParams.set(key, initialOptions[key]);
		if (options) for (let key in options) searchParams.set(key, options[key]);

		request(`https://api.vk.com/method/${method}?${new URLSearchParams(searchParams).toString()}`, (error, response, body) => {
			const bodyParse = JSON.parse(body);

			return bodyParse.error ? reject(bodyParse.error) : resolve(bodyParse.response);
		});
	});
};
