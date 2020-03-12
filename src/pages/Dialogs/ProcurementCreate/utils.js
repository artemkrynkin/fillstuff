export const positionTransform = position => ({
	_id: position._id,
	lastReceipt: position.receipts[position.receipts.length - 1],
	unitRelease: position.unitRelease,
	unitReceipt: position.unitReceipt,
	isFree: position.isFree,
	name: position.name,
	characteristics: position.characteristics,
	label: position.characteristics.reduce((fullName, characteristic) => `${fullName} ${characteristic.label}`, position.name),
	value: position._id,
});
