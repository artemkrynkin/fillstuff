import mongoose from 'mongoose';
// import validator from 'validator';
import i18n from 'i18n';

const Schema = mongoose.Schema;

let Product = new Schema({
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
	archived: {
		type: Boolean,
		default: false,
	},
	// Склад
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
	},
	/**
	 * штука - pce
	 * упаковка - nmp
	 */
	// Единица поступления
	receiptUnits: {
		type: String,
		enum: ['pce', 'nmp'],
		required: [true, i18n.__('Обязательное поле')],
	},
	// Единица отпуска
	unitIssue: {
		type: String,
		enum: ['pce', 'nmp'],
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
		required: [true, i18n.__('Обязательное поле')],
	},
	// Цена покупки
	purchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
	},
	// Цена продажи
	sellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
	},
	// Цена покупки единицы
	unitPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
	},
	// Цена продажи единицы
	unitSellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
	},
	// Бесплатный товар
	freeProduct: {
		type: Boolean,
		default: false,
	},
	// Id магазина
	shopId: {
		type: String,
		default: '',
		required: [true, i18n.__('Обязательное поле')],
	},
	// Характеристики
	specifications: [
		{
			nameId: {
				type: Schema.Types.ObjectId,
				required: [true, i18n.__('Обязательное поле')],
			},
			valueId: {
				type: Schema.Types.ObjectId,
				required: [true, i18n.__('Обязательное поле')],
			},
		},
	],
});

export default mongoose.model('Product', Product);
