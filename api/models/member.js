import mongoose from 'mongoose';
import i18n from 'i18n';

import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

const Member = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, i18n.__('Обязательное поле')],
	},
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	role: {
		type: String,
		enum: ['owner', 'admin', 'user', 'admin-user'],
		default: 'user',
	},
	confirmed: {
		type: Boolean,
		default: false,
	},
	deactivated: {
		type: Boolean,
		default: true,
	},
	guest: {
		type: Boolean,
	},
	invitationDate: {
		type: Date,
		default: Date.now,
	},
	accessExpires: {
		type: Date,
	},
	purchaseExpenseStudio: {
		type: Boolean,
		default: false,
	},
	billingFrequency: {
		type: Number,
		enum: [1, 7, 30],
		default: 7,
	},
	lastBillingDate: {
		type: Date,
	},
	nextBillingDate: {
		type: Date,
	},
	billingDebt: {
		type: Number,
		set: value => formatNumber(value),
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Member', Member);
