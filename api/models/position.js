import mongoose from 'mongoose';
import i18n from 'i18n';
import { v4 as uuidv4 } from 'uuid';

import { dbFillstuff } from 'shared/db';

import { printDestination, unitTypes } from 'shared/checkPositionAndReceipt';

const Schema = mongoose.Schema;

const Position = new Schema({
	// Наименование
	name: {
		type: String,
		minlength: [2, i18n.__('Не может быть короче 2 символов')],
		maxlength: [60, i18n.__('Не может превышать 60 символов')],
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	// Дата создания
	createdAt: {
		type: Date,
		default: Date.now,
	},
	// Родительская позиция
	parentPosition: {
		type: Schema.Types.ObjectId,
		ref: 'Position',
	},
	// Дочерняя позиция
	childPosition: {
		type: Schema.Types.ObjectId,
		ref: 'Position',
	},
	// ID QR-кода
	qrcodeId: {
		type: String,
		default: () => uuidv4(),
	},
	// Место печати
	printDestination: {
		type: String,
		enum: printDestination,
	},
	// Архивированный
	isArchived: {
		type: Boolean,
		default: false,
	},
	// Архивируется после окончания поступлений
	archivedAfterEnded: {
		type: Boolean,
	},
	// Ожидается доставка
	deliveryIsExpected: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Procurement',
		},
	],
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
  // Отслеживать остаток позиции
  trackBalance: {
    type: Boolean,
    default: true,
  },
	// Минимальный остаток
	minimumBalance: {
		type: Number,
		min: [1, 'Не может быть меньше 1'],
	},
	// Максимальный остаток
	maximumBalance: {
		type: Number,
		min: [1, 'Не может быть меньше 1'],
	},
	// Бесплатный товар
	isFree: {
		type: Boolean,
		default: false,
	},
	// Характеристики
	characteristics: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Characteristic',
		},
	],
	// Магазины
	shops: [
		{
			shop: {
				type: Schema.Types.ObjectId,
				ref: 'Shop',
			},
			link: {
				type: String,
				trim: true,
				default: '',
			},
			comment: {
				type: String,
				trim: true,
				default: '',
			},
			numberReceipts: {
				type: Number,
				default: 0,
			},
			lastProcurement: {
				type: Schema.Types.ObjectId,
				ref: 'Procurement',
			},
		},
	],
	// Имеет поступления
	hasReceipts: {
		type: Boolean,
		default: false,
	},
	// Уведомлять об отсутствии поступлений
	notifyReceiptMissing: {
		type: Boolean,
		default: false,
	},
	// Поступление на реализации
	activeReceipt: {
		type: Schema.Types.ObjectId,
		ref: 'Receipt',
	},
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

export default dbFillstuff.model('Position', Position);
