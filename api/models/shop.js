import mongoose from 'mongoose';
import i18n from 'i18n';

const Schema = mongoose.Schema;

let Shop = new Schema({
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	name: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
	},
	link: {
		type: String,
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default mongoose.model('Shop', Shop);
