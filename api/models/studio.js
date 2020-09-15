import mongoose from 'mongoose';
import i18n from 'i18n';
import momentTz from 'moment-timezone';

import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

const Studio = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	avatar: {
		type: String,
		default: null,
	},
	name: {
		type: String,
		minlength: [2, i18n.__('Название студии не может быть короче 2 символов')],
		maxlength: [60, i18n.__('Название студии не может превышать 60 символов')],
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	timezone: {
		type: String,
		default: !!~require('shared/timezones').indexOf(momentTz.tz.guess()) ? momentTz.tz.guess() : '',
	},
	settings: {
		procurements: {
			compensateCostDelivery: {
				type: Boolean,
				default: true,
			},
		},
	},
	// TODO: заменить параметр на stock
	store: {
		// TODO: заменить параметр на store
		// если есть платные позиции, то true, иначе false
		shop: {
			type: Boolean,
			default: false,
		},
		numberPositions: {
			type: Number,
			set: value => formatNumber(value, { fractionDigits: 0 }),
			default: 0,
		},
		// TODO: заменить параметр на stockPrice
		storePrice: {
			type: Number,
			set: value => formatNumber(value),
			default: 0,
		},
	},
	users: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		select: false,
	},
	members: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Member',
			},
		],
		select: false,
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Studio', Studio);
