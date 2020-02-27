import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import i18n from 'i18n';

import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

const Invoice = new Schema({
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	member: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
		required: [true, i18n.__('Обязательное поле')],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	fromDate: {
		type: Date,
		required: [true, i18n.__('Обязательное поле')],
	},
	toDate: {
		type: Date,
		required: [true, i18n.__('Обязательное поле')],
	},
	status: {
		type: String,
		enum: ['paid', 'partially-paid', 'unpaid'],
		default: 'unpaid',
	},
	datePayment: {
		type: Date,
	},
	payments: [
		{
			date: {
				type: Date,
			},
			amount: {
				type: Number,
				min: [0, 'Не может быть меньше 0'],
				default: 0,
				set: value => formatNumber(value),
			},
			// Участник принявший оплату за счет
			merchant: {
				type: Schema.Types.ObjectId,
				ref: 'Member',
			},
		},
	],
	paymentAmountDue: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	amount: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	writeOffs: [
		{
			type: Schema.Types.ObjectId,
			ref: 'WriteOff',
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

Invoice.plugin(mongoosePaginate);

export default mongoose.model('Invoice', Invoice);
