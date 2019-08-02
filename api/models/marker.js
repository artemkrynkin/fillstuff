import mongoose from 'mongoose';
// import validator from 'validator';
import i18n from 'i18n';

const Schema = mongoose.Schema;

let Marker = new Schema({
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
	// Позиция
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: [true, i18n.__('Обязательное поле')],
	},
	manufacturer: {
		type: Schema.Types.ObjectId,
		ref: 'Manufacturer',
		required: [true, i18n.__('Обязательное поле')],
	},
	// Количество
	quantity: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
	},
	// Количество упаковок
	quantityPackages: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
	},
	// Количество штук в упаковке
	quantityInUnit: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
	},
	// Минимальный остаток
	minimumBalance: {
		type: Number,
		min: [1, 'Не может быть меньше 1'],
	},
	// Цена покупки
	purchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		get: value => +value.toFixed(2),
		set: value => +value.toFixed(2),
	},
	// Цена продажи
	sellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		get: value => +value.toFixed(2),
		set: value => +value.toFixed(2),
	},
	// Цена покупки единицы
	unitPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		get: value => +value.toFixed(2),
		set: value => +value.toFixed(2),
	},
	// Цена продажи единицы
	unitSellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		get: value => +value.toFixed(2),
		set: value => +value.toFixed(2),
	},
	// Бесплатный товар
	isFree: {
		type: Boolean,
		default: false,
	},
	// Ссылка на товар в магазине
	linkInShop: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
	},
	// Характеристики
	specifications: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Specification',
			required: [true, i18n.__('Обязательное поле')],
		},
	],
});

export default mongoose.model('Marker', Marker);
