import mongoose from 'mongoose';
import i18n from 'i18n';
// import validator from 'validator';

import { numberToFixedDouble } from 'api/utils';

const Schema = mongoose.Schema;

let WriteOff = new Schema({
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
	},
	marker: {
		type: Schema.Types.ObjectId,
		ref: 'Marker',
		required: [true, i18n.__('Обязательное поле')],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, i18n.__('Обязательное поле')],
	},
	quantity: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [true, i18n.__('Обязательное поле')],
	},
	unitPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [true, i18n.__('Обязательное поле')],
		get: value => numberToFixedDouble(value),
		set: value => numberToFixedDouble(value),
	},
	unitSellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		get: value => numberToFixedDouble(value),
		set: value => numberToFixedDouble(value),
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('WriteOff', WriteOff);
