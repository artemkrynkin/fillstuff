import { getIn } from 'formik';

import theme from 'shared/theme';

import { history } from './history';

export const isNumeric = num => {
	return !isNaN(parseFloat(num)) && isFinite(num);
};

export const isInteger = num => {
	return (num ^ 0) === num;
};

export const kiloFormat = num => {
	let kilo,
		decimalNum = num / 1000;

	if (num > 999) {
		if (num > 999 && num <= 9999) {
			kilo = isInteger(decimalNum) ? decimalNum : isInteger(+decimalNum.toFixed(1)) ? Math.round(decimalNum) : decimalNum.toFixed(1);
		} else if (num > 9999) {
			kilo = Math.round(decimalNum);
		}

		kilo += 'K';
	} else {
		kilo = num;
	}

	return kilo.toString();
};

export const capitalizeFirstLetter = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncate = (str, maxlength) => {
	return str.length > maxlength ? str.slice(0, maxlength - 3) + '..' : str;
};

export const declensionNumber = (number, titles) => {
	const cases = [2, 0, 1, 1, 1, 2];

	return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
};

export const calculateColor = text => {
	let sum = 0;
	for (let index in text) {
		sum += text.charCodeAt(index);
	}
	return theme.calculateColors[sum % theme.calculateColors.length];
};

export const changeStockCurrentUrl = stockId => {
	let location = history.location,
		pathnameArray = location.pathname.split('/');

	if (pathnameArray[1] === 'stocks') {
		if (stockId) {
			pathnameArray[2] = stockId;

			switch (pathnameArray[3]) {
				case 'dashboard':
				case 'statistics':
				case 'settings':
					break;
				default:
					pathnameArray[3] = 'dashboard';
					break;
			}
		} else pathnameArray = pathnameArray.splice(0, 2);

		return pathnameArray.join('/');
	}

	return location.pathname;
};

export const formError = (touched, errors, name, helperText = null) => {
	const error = getIn(errors, name);
	const touch = getIn(touched, name);
	return touch && error ? error : helperText;
};
