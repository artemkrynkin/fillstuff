import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import i18n from 'i18n';

import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

const Procurement = new Schema({
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
	orderedByMember: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
	},
	receivedByMember: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
	},
	status: {
		type: String,
		enum: ['expected', 'received'],
	},
	shop: {
		type: String,
		ref: 'Shop',
		required: [true, i18n.__('Обязательное поле')],
	},
	deliveryDate: {
		type: Date,
		required: [
			function() {
				return this.status === 'expected';
			},
			i18n.__('Обязательное поле'),
		],
	},
	deliveryTimeFrom: {
		type: Date,
		required: [
			function() {
				return this.status === 'expected';
			},
			i18n.__('Обязательное поле'),
		],
	},
	deliveryTimeTo: {
		type: Date,
		required: [
			function() {
				return this.status === 'expected';
			},
			i18n.__('Обязательное поле'),
		],
	},
	noInvoice: {
		type: Boolean,
		required: [
			function() {
				return this.status === 'received';
			},
			i18n.__('Обязательное поле'),
		],
	},
	invoiceNumber: {
		type: String,
		trim: true,
		required: [
			function() {
				return this.status === 'received' && !this.noInvoice;
			},
			i18n.__('Обязательное поле'),
		],
	},
	invoiceDate: {
		type: Date,
		required: [
			function() {
				return this.status === 'received' && !this.noInvoice;
			},
			i18n.__('Обязательное поле'),
		],
	},
	pricePositions: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	costDelivery: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	totalPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [
			function() {
				return this.status === 'received';
			},
			i18n.__('Обязательное поле'),
		],
		set: value => formatNumber(value),
	},
	compensateCostDelivery: {
		type: Boolean,
		required: [
			function() {
				return this.status === 'received';
			},
			i18n.__('Обязательное поле'),
		],
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
