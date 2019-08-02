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
	dividedMarkers: {
		type: Boolean,
		default: true,
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
	},
	// Минимальный остаток
	minimumBalance: {
		type: Number,
		min: [1, 'Не может быть меньше 1'],
	},
	// Маркеры
	markers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Marker',
			required: [true, i18n.__('Обязательное поле')],
		},
	],
});

export default mongoose.model('Product', Product);
