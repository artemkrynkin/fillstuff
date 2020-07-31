import AsyncStorage from '@react-native-community/async-storage';

export const getItem = async key => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (e) {
		// read error
	}
};

export const getItemObject = async key => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);

		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		// read error
	}
};

export const setItem = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		// save error
	}
};

export const setItemObject = async (key, value) => {
	try {
		const jsonValue = JSON.stringify(value);

		await AsyncStorage.setItem(key, jsonValue);
	} catch (e) {
		// save error
	}
};

export const removeItem = async key => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		// remove error
	}
};

export const clearAll = async () => {
	try {
		await AsyncStorage.clear();
	} catch (e) {
		// clear error
	}
};
