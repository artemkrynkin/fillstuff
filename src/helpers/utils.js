import { getIn } from 'formik';
import moment from 'moment';

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

export const declensionNumber = (number, titles, showNumber = false) => {
	const cases = [2, 0, 1, 1, 1, 2];

	const declensionTitles = titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];

	return showNumber ? `${number} ${declensionTitles}` : declensionTitles;
};

export const calculateColor = text => {
	const colors = [
		'#f44336',
		'#e91e63',
		'#9c27b0',
		'#673ab7',
		'#3f51b5',
		'#2196f3',
		'#03a9f4',
		'#00bcd4',
		'#009688',
		'#4caf50',
		'#8bc34a',
		'#cddc39',
		'#ffeb3b',
		'#ffc107',
		'#ff9800',
		'#ff5722',
		'#795548',
		'#9e9e9e',
		'#607d8b',
	];
	let sum = 0;
	for (let index in text) {
		sum += text.charCodeAt(index);
	}
	return colors[sum % colors.length];
};

export const formError = (touched, errors, name) => {
	const error = getIn(errors, name);
	const touch = getIn(touched, name);
	return Boolean(touch && error);
};

export const formErrorHelperText = (touched, errors, name, helperText = null) => {
	const error = getIn(errors, name);
	const touch = getIn(touched, name);
	return touch && typeof error === 'string' ? error : helperText;
};

export const procurementPositionTransform = position => ({
	_id: position._id,
	lastReceipt: position.receipts[position.receipts.length - 1],
	unitRelease: position.unitRelease,
	unitReceipt: position.unitReceipt,
	isFree: position.isFree,
	name: position.name,
	characteristics: position.characteristics,
	label: position.characteristics.reduce(
		(fullName, characteristic) => `${fullName ? `${fullName} ` : ''}${characteristic.name}`,
		position.name
	),
	value: position._id,
});

export const getDeliveryDateTimeMoment = (deliveryDate, deliveryTime, type = '') => {
	const localTime = type === 'from' ? [0, 0, 0] : [23, 59, 0];
	const deliveryTimeParse = deliveryTime ? [...deliveryTime.split(':'), 0] : localTime;

	if (!deliveryDate) return null;

	return moment(deliveryDate).set({ hour: deliveryTimeParse[0], minute: deliveryTimeParse[1], second: deliveryTimeParse[2] });
};
