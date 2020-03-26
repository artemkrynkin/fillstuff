import mongoose from 'mongoose';
import i18n from 'i18n';

import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

let Receipt = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	procurement: {
		type: Schema.Types.ObjectId,
		ref: 'Procurement',
	},
	position: {
		type: Schema.Types.ObjectId,
		ref: 'Position',
		required: [true, i18n.__('Обязательное поле')],
	},
	status: {
		type: String,
		enum: ['received', 'active', 'closed'],
		default: 'received',
	},
	current: {
		// Количество
		quantity: {
			type: Number,
			min: [0, 'Не может быть меньше 0'],
			required: [true, i18n.__('Обязательное поле')],
			set: value => formatNumber(value, { fractionDigits: 0 }),
		},
		// Количество упаковок
		quantityPackages: {
			type: Number,
			min: [0, 'Не может быть меньше 0'],
			set: value => formatNumber(value),
		},
	},
	initial: {
		// Количество
		quantity: {
			type: Number,
			min: [0, 'Не может быть меньше 0'],
			required: [true, i18n.__('Обязательное поле')],
			set: value => formatNumber(value, { fractionDigits: 0 }),
		},
		// Количество упаковок
		quantityPackages: {
			type: Number,
			min: [0, 'Не может быть меньше 0'],
			set: value => formatNumber(value),
		},
	},
	additions: [
		{
			createdAt: {
				type: Date,
				default: Date.now,
			},
			quantity: {
				type: Number,
				min: [0, 'Не может быть меньше 0'],
				required: [true, i18n.__('Обязательное поле')],
				set: value => formatNumber(value, { fractionDigits: 0 }),
			},
			comment: {
				type: String,
				trim: true,
			},
		},
	],
	// Количество штук в упаковке
	quantityInUnit: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		set: value => formatNumber(value, { fractionDigits: 0 }),
	},
	// Цена покупки
	purchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [true, i18n.__('Обязательное поле')],
		set: value => formatNumber(value),
	},
	unitPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [true, i18n.__('Обязательное поле')],
		set: value => formatNumber(value),
	},
	// Цена продажи
	sellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [true, i18n.__('Обязательное поле')],
		set: value => formatNumber(value),
	},
	unitSellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [true, i18n.__('Обязательное поле')],
		set: value => formatNumber(value),
	},
	// Стоимость доставки
	costDelivery: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	unitCostDelivery: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	// Наценка в процентах
	markupPercent: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value, { fractionDigits: 4 }),
	},
	// Наценка
	markup: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	unitMarkup: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Receipt', Receipt);
