import cors from 'cors';

export const corsOptions = {
	origin:
		process.env.NODE_ENV === 'production'
			? [
					'https://posterdate.com',
					/\.posterdate\.com$/,
					process.env.NOW_URL,
					// 'https://zeit.co',
					// /(\.|https:\/\/)zeit\.sh$/,
			  ].filter(Boolean)
			: [/localhost/],
	credentials: true,
};

export default cors(corsOptions);
