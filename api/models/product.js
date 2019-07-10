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
	archived: {
		type: Boolean,
		default: false,
	},
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
	},
	categoryId: {
		type: String,
		default: '',
	},
	/**
	 * штука - pce
	 * упаковка - nmp
	 * рулон - npl
	 * бутыль - bot
	 */
	receiptUnits: {
		type: String,
		enum: ['pce', 'nmp', 'npl', 'bot'],
		required: [true, i18n.__('Обязательное поле')],
	},
	unitIssue: {
		type: String,
		enum: ['pce', 'nmp'],
	},
	quantity: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
	},
	quantityInUnit: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
	},
	minimumBalance: {
		type: Number,
		min: [1, 'Не может быть меньше 1'],
		required: [true, i18n.__('Обязательное поле')],
	},
	purchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
	},
	sellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
	},
	margin: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
	},
	unitPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
	},
	unitSellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
	},
	shopId: {
		type: String,
		default: '',
	},
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
