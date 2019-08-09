export const numberToFixedDouble = value => {
	if (value !== undefined && !isNaN(value)) return +value.toFixed(2);
};
