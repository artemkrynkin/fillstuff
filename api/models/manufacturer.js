import mongoose from 'mongoose';
import i18n from 'i18n';

const Schema = mongoose.Schema;

let Manufacturer = new Schema({
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
	},
	value: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
		lowercase: true,
		trim: true,
	},
	label: {
		type: String,
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
});

export default mongoose.model('Manufacturer', Manufacturer);
