import mongoose from 'mongoose';

import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

const Member = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
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
	createdAt: {
		type: Date,
		default: Date.now,
	},
	invitationExpires: {
		type: Date,
	},
	guest: {
		type: Boolean,
		default: false,
	},
	billingPeriod: {
		type: String,
		enum: [1, 7, 30],
	},
	prevPaymentDate: {
		type: Date,
	},
	nextPaymentDate: {
		type: Date,
	},
	currentCredit: {
		type: Number,
		default: 0,
		set: value => formatNumber(value),
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Member', Member);
