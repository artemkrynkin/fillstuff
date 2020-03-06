export const positionTransform = position => ({
	_id: position._id,
	unitRelease: position.unitRelease,
	unitReceipt: position.unitReceipt,
	isFree: position.isFree,
	extraCharge: position.extraCharge,
	name: position.name,
	characteristics: position.characteristics,
	label: position.characteristics.reduce((fullName, characteristic) => `${fullName} ${characteristic.label}`, position.name),
	value: position._id,
});
