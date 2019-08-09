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
	createdAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		numberProducts: {
			type: Number,
			default: 0,
		},
		numberMarkers: {
			type: Number,
			default: 0,
		},
		stockCost: {
			type: Number,
			default: 0,
			get: value => numberToFixedDouble(value),
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
				enum: ['owner', 'admin', 'user'],
				default: 'user',
			},
			isWaiting: Boolean,
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

export default mongoose.model('Stock', Stock);
