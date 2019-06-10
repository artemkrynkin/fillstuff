export const truncate = (str, length) => {
	if (str.length <= length) return str;

	let subString = str.substr(0, length);

	return subString.substr(0, subString.lastIndexOf(' ')).replace(/\n/, ' ') + '…';
};
