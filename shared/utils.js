export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const percentOfNumber = (number, percent) => number * (percent / 100);

export const formatNumber = (
	value,
	{ toString, fractionDigits } = {
		toString: false,
		fractionDigits: 2,
	}
) => {
	const formattedValue = Number(Number(value).toFixed(fractionDigits));

	return !toString ? formattedValue : formattedValue.toFixed(fractionDigits);
};
