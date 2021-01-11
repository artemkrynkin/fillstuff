import cors from 'cors';

export const corsOptions = {
	origin: process.env.NODE_ENV === 'production' ? ['https://fillstuff.keeberink.com', /\.keeberink\.com$/].filter(Boolean) : [/localhost/],
	credentials: true,
};

export default cors(corsOptions);
