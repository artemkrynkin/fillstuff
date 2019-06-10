import chroma from 'chroma-js';

import colorPalette from 'shared/colorPalette';

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
			kilo = isInteger(decimalNum)
				? decimalNum
				: isInteger(+decimalNum.toFixed(1))
				? Math.round(decimalNum)
				: decimalNum.toFixed(1);
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

export const isDark = color => {
	return chroma(color).get('lab.l') < 75;
};

export const hexToRgb = hex =>
	hex
		.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
		.substring(1)
		.match(/.{2}/g)
		.map(x => parseInt(x, 16));

export const calculateColor = text => {
	let sum = 0;
	for (let index in text) {
		sum += text.charCodeAt(index);
	}
	return colorPalette.calculateColors[sum % colorPalette.calculateColors.length];
};

export const changeProjectCurrentUrl = projectId => {
	let location = history.location,
		pathnameArray = location.pathname.split('/');

	if (pathnameArray[1] === 'projects') {
		if (projectId) {
			pathnameArray[2] = projectId;

			switch (pathnameArray[3]) {
				case 'feed':
				case 'content-plan':
				case 'statistics':
				case 'settings':
				case 'social-pages':
					break;
				default:
					pathnameArray[3] = 'feed';
					break;
			}
		} else pathnameArray = pathnameArray.splice(0, 2);

		return pathnameArray.join('/');
	}

	return location.pathname;
};
