import mongoose from 'mongoose';
// import validator from 'validator';

const Schema = mongoose.Schema;

let WriteOff = new Schema({
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	quantity: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('WriteOff', WriteOff);
