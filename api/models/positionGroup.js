import mongoose from 'mongoose';
// import validator from 'validator';
import i18n from 'i18n';

const Schema = mongoose.Schema;

let PositionGroup = new Schema({
	name: {
		type: String,
		minlength: [2, i18n.__('Не может быть короче 2 символов')],
		maxlength: [100, i18n.__('Не может превышать 100 символов')],
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	// Склад
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
	},
	dividedPositions: {
		type: Boolean,
		default: true,
	},
	// Минимальный остаток
	minimumBalance: {
		type: Number,
		min: [1, 'Не может быть меньше 1'],
	},
	// Позиции
	positions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Position',
			required: [true, i18n.__('Обязательное поле')],
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('PositionGroup', PositionGroup);
