export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const percentOfNumber = (number, percent) => number * (percent / 100);

export const formatNumber = (value, options = { toString: false, fractionDigits: 2 }) => {
	const { toString, fractionDigits } = {
		toString: false,
		fractionDigits: 2,
		...options,
	};

	const formattedValue = Number(value).toFixed(fractionDigits);

	return toString ? Number(formattedValue).toFixed(fractionDigits) : Number(formattedValue);
};

export const extractHostname = url => {
	let hostname;
	//find & remove protocol (http, ftp, etc.) and get hostname

	if (url.indexOf('//') > -1) hostname = url.split('/')[2];
	else hostname = url.split('/')[0];

	//find & remove port number
	hostname = hostname.split(':')[0];
	//find & remove "?"
	hostname = hostname.split('?')[0];

	return hostname;
};

export const timesInterval15Minutes = [
	'00:00',
	'01:00',
	'02:00',
	'03:00',
	'04:00',
	'05:00',
	'06:00',
	'07:00',
	'08:00',
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
	'19:00',
	'20:00',
	'21:00',
	'22:00',
	'23:00',
];
