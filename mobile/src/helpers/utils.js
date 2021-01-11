export const percentOfNumber = (number, percent) => number * (percent / 100);

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const isJson = data => {
	try {
		JSON.parse(data);
	} catch (e) {
		return false;
	}
	return true;
};

/**
 * Capitalizes first letters of words in string.
 * @param {string} str String to be modified
 * @param {boolean=false} lower Whether all other letters should be lowercased
 * @return {string}
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
 */
export const capitalize = (str, lower = false) => {
	return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
};

export const formatNumber = (value, options = { toString: false, fractionDigits: 2 }) => {
	const { toString, fractionDigits } = {
		toString: false,
		fractionDigits: 2,
		...options,
	};

	const formattedValue = Number(value).toFixed(fractionDigits);

	return toString ? Number(formattedValue).toFixed(fractionDigits) : Number(formattedValue);
};
