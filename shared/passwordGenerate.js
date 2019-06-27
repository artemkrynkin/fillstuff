import generatePassword from 'password-generator';

const maxLength = 10;
const minLength = 10;
const uppercaseMinCount = 3;
const lowercaseMinCount = 3;
const numberMinCount = 2;
const specialMinCount = 2;
const UPPERCASE_RE = /([A-Z])/g;
const LOWERCASE_RE = /([a-z])/g;
const NUMBER_RE = /([\d])/g;
const SPECIAL_CHAR_RE = /([\?\-])/g;
const NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

function isStrongEnough(password) {
	let uc = password.match(UPPERCASE_RE);
	let lc = password.match(LOWERCASE_RE);
	let n = password.match(NUMBER_RE);
	let sc = password.match(SPECIAL_CHAR_RE);
	let nr = password.match(NON_REPEATING_CHAR_RE);

	return (
		password.length >= minLength &&
		!nr &&
		uc &&
		uc.length >= uppercaseMinCount &&
		lc &&
		lc.length >= lowercaseMinCount &&
		n &&
		n.length >= numberMinCount &&
		sc &&
		sc.length >= specialMinCount
	);
}

function customPassword() {
	let password = '';
	let randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;

	while (!isStrongEnough(password)) {
		password = generatePassword(randomLength, false, /[\w\d\?\-]/);
	}

	return password;
}

export default customPassword;
