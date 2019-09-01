import mongoose from 'mongoose';
import i18n from 'i18n';

import { characteristicsTypes } from 'shared/checkPositionAndReceipt';

const Schema = mongoose.Schema;

let Characteristic = new Schema({
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	type: {
		type: String,
		enum: characteristicsTypes,
	},
	value: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
		lowercase: true,
		trim: true,
	},
	label: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Characteristic', Characteristic);
