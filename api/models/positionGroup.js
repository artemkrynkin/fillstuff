import mongoose from 'mongoose';
import i18n from 'i18n';
import { v4 as uuidv4 } from 'uuid';

import { dbFillstuff } from 'shared/db';

const Schema = mongoose.Schema;

const PositionGroup = new Schema({
	name: {
		type: String,
		minlength: [2, i18n.__('Не может быть короче 2 символов')],
		maxlength: [60, i18n.__('Не может превышать 60 символов')],
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	qrcodeId: {
		type: String,
		default: () => uuidv4(),
	},
	// Студия
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
	},
	// Позиции
	positions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Position',
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

export default dbFillstuff.model('PositionGroup', PositionGroup);
