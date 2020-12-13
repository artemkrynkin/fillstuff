import mongoose from 'mongoose';

import { dbAccount } from 'shared/db';

const Schema = mongoose.Schema;

const User = new Schema({
	auth0uid: {
		type: String,
		required: true,
		select: false,
	},
	picture: {
		type: String,
		default: null,
	},
	name: {
		type: String,
		default: '',
	},
	settings: {
		studio: {
			type: Schema.Types.ObjectId,
			ref: 'Studio',
			default: null,
		},
		member: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			default: null,
		},
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default dbAccount.model('User', User);
