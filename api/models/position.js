import mongoose from 'mongoose';
// import validator from 'validator';
import i18n from 'i18n';

import { unitTypes } from 'shared/checkPositionAndReceipt';

const Schema = mongoose.Schema;

let Position = new Schema({
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
	// Архивированый
	isArchived: {
		type: Boolean,
		default: false,
	},
	// Склад
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
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
	extraCharge: {
		type: Number,
		default: 0,
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
			required: [true, i18n.__('Обязательное поле')],
		},
	],
	// Поступления
	receipts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Receipt',
			required: [true, i18n.__('Обязательное поле')],
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Position', Position);
