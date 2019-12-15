import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import i18n from 'i18n';
// import validator from 'validator';

import { numberToFixedDouble } from 'api/utils';

const Schema = mongoose.Schema;

let Procurement = new Schema({
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
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, i18n.__('Обязательное поле')],
	},
	number: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
	},
	date: {
		type: Date,
		required: [true, i18n.__('Обязательное поле')],
	},
	costDelivery: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value, 0),
	},
	purchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value, 0),
	},
	totalPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => numberToFixedDouble(value, 0),
	},
	divideCostDeliverySellingPositions: {
		type: Boolean,
		default: false,
	},
	receipts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Receipt',
			required: [true, i18n.__('Обязательное поле')],
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

Procurement.plugin(mongoosePaginate);

export default mongoose.model('Procurement', Procurement);
