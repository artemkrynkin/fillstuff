import mongoose from 'mongoose';
import i18n from 'i18n';
import momentTz from 'moment-timezone';

import { numberToFixedDouble } from 'api/utils';

const Schema = mongoose.Schema;

let Stock = new Schema({
	name: {
		type: String,
		minlength: [2, i18n.__('Название склада не может быть короче 2 символов')],
		maxlength: [60, i18n.__('Название склада не может превышать 60 символов')],
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	timezone: {
		type: String,
		default: !!~require('shared/timezones').indexOf(momentTz.tz.guess()) ? momentTz.tz.guess() : '',
	},
	settings: {
		procurements: {
			divideCostDeliverySellingPositions: {
				type: Boolean,
				default: false,
			},
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		numberPositions: {
			type: Number,
			default: 0,
		},
		stockPrice: {
			type: Number,
			default: 0,
			// get: value => numberToFixedDouble(value),
			set: value => numberToFixedDouble(value),
		},
	},
	members: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
			role: {
				type: String,
				enum: ['owner', 'admin', 'user', 'fired'],
				default: 'user',
			},
			isWaiting: Boolean,
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Stock', Stock);
