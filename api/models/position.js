import mongoose from 'mongoose';
import i18n from 'i18n';

import { unitTypes } from 'shared/checkPositionAndReceipt';
import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

let Position = new Schema({
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
	// Архивированый
	isArchived: {
		type: Boolean,
		default: false,
	},
	// Студия
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
	},
	// Группа
	positionGroup: {
		type: Schema.Types.ObjectId,
		ref: 'PositionGroup',
	},
	divided: {
		type: Boolean,
		default: true,
	},
	/**
	 * штука - pce
	 * упаковка - nmp
	 */
	// Единица поступления
	unitReceipt: {
		type: String,
		enum: unitTypes,
		required: [true, i18n.__('Обязательное поле')],
	},
	// Единица отпуска
	unitIssue: {
		type: String,
		enum: unitTypes,
		required: [true, i18n.__('Обязательное поле')],
	},
	activeReceipt: {
		type: Schema.Types.ObjectId,
		ref: 'Receipt',
	},
	// Минимальный остаток
	minimumBalance: {
		type: Number,
		min: [1, 'Не может быть меньше 1'],
	},
	// Бесплатный товар
	isFree: {
		type: Boolean,
		default: false,
	},
	// Процент наценки
	extraCharge: {
		type: Number,
		default: 0,
		min: [0, 'Не может быть меньше 0'],
		set: value => formatNumber(value, { fractionDigits: 0 }),
	},
	// Название магазина
	shopName: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
	},
	// Ссылка на товар в магазине
	shopLink: {
		type: String,
	},
	// Характеристики
	characteristics: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Characteristic',
		},
	],
	// Поступления
	receipts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Receipt',
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Position', Position);
