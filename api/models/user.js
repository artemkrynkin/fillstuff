import mongoose from 'mongoose';

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
		},
		member: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
		},
	},
	studios: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Studio',
		},
	],
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('User', User);
