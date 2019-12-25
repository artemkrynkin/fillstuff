export const positionTransform = position => ({
	_id: position._id,
	unitIssue: position.unitIssue,
	unitReceipt: position.unitReceipt,
	isFree: position.isFree,
	extraCharge: position.extraCharge,
	label:
		position.name +
		position.characteristics.reduce((fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`, ''),
	value: position._id,
});
