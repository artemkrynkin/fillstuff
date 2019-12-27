export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const percentOfNumber = (number, percent) => number * (percent / 100);

export const formatToCurrency = (
	value,
	{ toString, fractionDigits } = {
		toString: false,
		fractionDigits: 2,
	}
) => {
	const formattedValue = Number(Number(value).toFixed(2));

	return !toString ? formattedValue : formattedValue.toFixed(fractionDigits);
};
