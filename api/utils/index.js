export const numberToFixedDouble = (value, fractionDigits = 2) => {
	if (value !== undefined && !isNaN(value)) return +value.toFixed(fractionDigits);
};
