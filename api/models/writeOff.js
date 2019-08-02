import mongoose from 'mongoose';
import i18n from 'i18n';
// import validator from 'validator';

const Schema = mongoose.Schema;

let WriteOff = new Schema({
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: [true, i18n.__('Обязательное поле')],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, i18n.__('Обязательное поле')],
	},
	quantity: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('WriteOff', WriteOff);
