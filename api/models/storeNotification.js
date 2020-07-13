import mongoose from 'mongoose';
import i18n from 'i18n';

const Schema = mongoose.Schema;

const StoreNotification = new Schema({
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	type: {
		type: String,
		enum: ['position-ends', 'delivery-is-expected', 'member-invoice', 'cancel-write-off'],
		required: [true, i18n.__('Обязательное поле')],
	},
	position: {
		type: Schema.Types.ObjectId,
		ref: 'Position',
		required: [
			function() {
				return this.type === 'position-ends';
			},
			i18n.__('Обязательное поле'),
		],
	},
	procurement: {
		type: Schema.Types.ObjectId,
		ref: 'Procurement',
		required: [
			function() {
				return this.type === 'delivery-is-expected';
			},
			i18n.__('Обязательное поле'),
		],
	},
	invoice: {
		type: Schema.Types.ObjectId,
		ref: 'Invoice',
		required: [
			function() {
				return this.type === 'invoice-paid-positions';
			},
			i18n.__('Обязательное поле'),
		],
	},
	writeOff: {
		type: Schema.Types.ObjectId,
		ref: 'WriteOff',
		required: [
			function() {
				return this.type === 'cancel-write-off';
			},
			i18n.__('Обязательное поле'),
		],
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('StoreNotification', StoreNotification);
