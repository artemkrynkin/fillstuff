export const positionTransform = position => ({
	_id: position._id,
	activeReceipt: position.activeReceipt,
	unitRelease: position.unitRelease,
	unitReceipt: position.unitReceipt,
	isFree: position.isFree,
	name: position.name,
	characteristics: position.characteristics,
	label: position.characteristics.reduce((fullName, characteristic) => `${fullName} ${characteristic.label}`, position.name),
	value: position._id,
});
