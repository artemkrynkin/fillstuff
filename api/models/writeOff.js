import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import i18n from 'i18n';
import { formatNumber } from 'shared/utils';
// import validator from 'validator';

const Schema = mongoose.Schema;

let WriteOff = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, i18n.__('Обязательное поле')],
	},
	position: {
		type: Schema.Types.ObjectId,
		ref: 'Position',
		required: [true, i18n.__('Обязательное поле')],
	},
	receipt: {
		type: Schema.Types.ObjectId,
		ref: 'Receipt',
		required: [true, i18n.__('Обязательное поле')],
	},
	isFree: {
		type: Boolean,
		default: false,
	},
	paymentDate: Date,
	paymentStatus: {
		type: String,
		enum: ['paid', 'unpaid'],
	},
	merchant: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	quantity: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [true, i18n.__('Обязательное поле')],
	},
	cost: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	unitSellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	unitExtraCharge: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	unitManualExtraCharge: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	comment: {
		type: String,
		trim: true,
	},
	__v: {
		type: Number,
		select: false,
	},
});

WriteOff.plugin(mongoosePaginate);

export default mongoose.model('WriteOff', WriteOff);
