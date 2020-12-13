import mongoose from 'mongoose';
import i18n from 'i18n';

import { dbFillstuff } from 'shared/db';

import { characteristicsTypes } from 'shared/checkPositionAndReceipt';

const Schema = mongoose.Schema;

const Characteristic = new Schema({
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	type: {
		type: String,
		enum: characteristicsTypes,
	},
	name: {
		type: String,
		maxlength: [60, i18n.__('Не может превышать 60 символов')],
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default dbFillstuff.model('Characteristic', Characteristic);
