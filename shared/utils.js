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
