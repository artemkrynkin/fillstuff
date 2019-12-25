import mongoose from 'mongoose';
// import validator from 'validator';
import i18n from 'i18n';

import { numberToFixedDouble } from 'api/utils';

const Schema = mongoose.Schema;

let Receipt = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	position: {
		type: Schema.Types.ObjectId,
		ref: 'Position',
		required: [true, i18n.__('Обязательное поле')],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	status: {
		type: String,
		enum: ['expected', 'received', 'active', 'closed'],
		default: 'expected',
	},
	current: {
		// Количество
		quantity: {
			type: Number,
			min: [0, 'Не может быть меньше 0'],
			required: [true, i18n.__('Обязательное поле')],
			// get: value => numberToFixedDouble(value, 0),
			set: value => numberToFixedDouble(value, 0),
		},
		// Количество упаковок
		quantityPackages: {
			type: Number,
			min: [0, 'Не может быть меньше 0'],
			// get: value => numberToFixedDouble(value, 0),
			set: value => numberToFixedDouble(value, 2),
		},
	},
	initial: {
		// Количество
		quantity: {
			type: Number,
			min: [0, 'Не может быть меньше 0'],
			required: [true, i18n.__('Обязательное поле')],
			// get: value => numberToFixedDouble(value, 0),
			set: value => numberToFixedDouble(value, 0),
		},
		// Количество упаковок
		quantityPackages: {
			type: Number,
			min: [0, 'Не может быть меньше 0'],
			// get: value => numberToFixedDouble(value, 0),
			set: value => numberToFixedDouble(value, 2),
		},
	},
	additions: [
		{
			createdAt: {
				type: Date,
				default: Date.now,
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
				// get: value => numberToFixedDouble(value, 0),
				set: value => numberToFixedDouble(value, 0),
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
		// get: value => numberToFixedDouble(value, 0),
		set: value => numberToFixedDouble(value, 0),
	},
	// Цена покупки
	purchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		// get: value => numberToFixedDouble(value),
		set: value => numberToFixedDouble(value),
	},
	// Цена покупки единицы
	unitPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		// get: value => numberToFixedDouble(value),
		set: value => numberToFixedDouble(value),
	},
	// Цена продажи
	sellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		// get: value => numberToFixedDouble(value),
		set: value => numberToFixedDouble(value),
	},
	// Цена продажи единицы
	unitSellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		// get: value => numberToFixedDouble(value),
		set: value => numberToFixedDouble(value),
	},
	// Стоимость доставки
	costDelivery: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value),
	},
	// Стоимость доставки
	unitCostDelivery: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value),
	},
	// Наценка
	extraCharge: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value),
	},
	unitExtraCharge: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value),
	},
	// Ручная наценка
	manualExtraCharge: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value),
	},
	unitManualExtraCharge: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value),
	},
	comment: {
		type: String,
		trim: true,
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Receipt', Receipt);
