import mongoose from 'mongoose';
import i18n from 'i18n';

import { unitTypes } from 'shared/checkPositionAndReceipt';

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
	// Архивируется после окончания поступлений
	archivedAfterEnded: {
		type: Boolean,
	},
	// Ожидается доставка
	deliveryIsExpected: {
		type: Boolean,
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
	unitRelease: {
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
	// Название магазина
	shopName: {
		type: String,
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
