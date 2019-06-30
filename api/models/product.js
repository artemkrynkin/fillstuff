import mongoose from 'mongoose';
// import validator from 'validator';
import i18n from 'i18n';

let Product = new mongoose.Schema({
	name: {
		type: String,
		minlength: [2, i18n.__('Наименование товара не может быть короче 2 символов')],
		maxlength: [100, i18n.__('Наименование товара не может превышать 100 символов')],
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	categoryId: {
		type: String,
		default: '',
	},
	amount: {
		type: Number,
		min: [0, 'Количество товара не может быть меньше 0'],
		default: 0,
	},
	purchasePrice: {
		type: Number,
		min: [0, 'Цена закупки товара не может быть меньше 0'],
		default: 0,
	},
	sellingPrice: {
		type: Number,
		min: [0, 'Цена продажи товара не может быть меньше 0'],
		default: 0,
	},
	/**
	 * штука - pce
	 * упаковка - nmp
	 * рулон - npl
	 * бутыль - bot
	 */
	unit: {
		type: String,
		enum: ['pce', 'nmp', 'npl', 'bot'],
		required: [true, i18n.__('Обязательное поле')],
	},
	minimumBalance: {
		type: Number,
		min: [1, 'Неснижаемый остаток не может быть меньше 1'],
		required: [true, i18n.__('Обязательное поле')],
	},
	shop: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
	},
	specifications: [
		{
			name: {
				type: String,
				required: [true, i18n.__('Обязательное поле')],
			},
			valueId: {
				type: String,
				required: [true, i18n.__('Обязательное поле')],
			},
		},
	],
	stock: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Stock',
	},
});

export default mongoose.model('Product', Product);
