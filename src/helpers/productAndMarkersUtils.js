import { characteristicsTypes } from 'shared/checkProductAndMarkers';

export const compareByName = (a, b) => {
	if (a.name > b.name) return 1;
	else if (a.name < b.name) return -1;
	else return 0;
};

export const onAddCharacteristicInMarker = (marker, index = undefined, setFieldValue, arrayHelpersCharacteristics) => {
	arrayHelpersCharacteristics.push(marker.characteristicTemp.value);

	setFieldValue(index !== undefined ? `markers.${index}.characteristicTemp` : 'characteristicTemp', {
		type: '',
		value: '',
		valueTemp: '',
	});
};

export const checkCharacteristicsOnAbsenceInMarker = (marker, mainAbsence = false) => {
	return characteristicsTypes.filter(characteristicType => {
		if (mainAbsence) return !marker.characteristics.some(markerCharacteristic => markerCharacteristic.type === characteristicType);
		else
			return (
				!(marker.mainCharacteristicTemp.type === characteristicType) &&
				!marker.characteristics.some(markerCharacteristic => markerCharacteristic.type === characteristicType)
			);
	});
};

export const onUnitSellingPriceCalc = (value, fieldName, marker, index = undefined, setFieldValue) => {
	setFieldValue(index !== undefined ? `markers.${index}.${fieldName}` : fieldName, value);

	const checkEmptinessField = marker[`${fieldName === 'quantityInUnit' ? 'purchasePrice' : 'quantityInUnit'}`];
	const setValue = fieldName === 'quantityInUnit' ? marker.purchasePrice / value : value / marker.quantityInUnit;
	const conditionSetValue = !!value && !!checkEmptinessField ? setValue.toFixed(2) : '';

	setFieldValue(index !== undefined ? `markers.${index}.unitSellingPrice` : 'unitSellingPrice', conditionSetValue);
};
