import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import i18n from 'i18n';

import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

let Procurement = new Schema({
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
	member: {
		type: String,
		ref: 'Member',
		required: [true, i18n.__('Обязательное поле')],
	},
	number: {
		type: String,
		trim: true,
	},
	date: Date,
	noInvoice: {
		type: Boolean,
		default: false,
	},
	costDelivery: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	pricePositions: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	totalPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	compensateCostDelivery: {
		type: Boolean,
		default: false,
	},
	positions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Position',
		},
	],
	receipts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Receipt',
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

Procurement.plugin(mongoosePaginate);

export default mongoose.model('Procurement', Procurement);
