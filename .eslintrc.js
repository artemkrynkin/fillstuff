module.exports = {
	extends: 'react-app',
	env: {
		es6: true,
		node: true,
	},
	rules: {
		'import/first': 0,
		'no-useless-escape': 1,
	},
	globals: {
		__DEV__: false,
	},
};
