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
	categoryId: {
		type: String,
		default: '',
	},
	stock: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Stock',
	},
});

export default mongoose.model('Product', Product);
