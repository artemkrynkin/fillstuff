import mongoose from 'mongoose';
import i18n from 'i18n';

import { specifications } from 'shared/productSpecifications';

const Schema = mongoose.Schema;

let Specification = new Schema({
	stock: {
		type: Schema.Types.ObjectId,
		ref: 'Stock',
		required: [true, i18n.__('Обязательное поле')],
	},
	name: {
		type: String,
		enum: specifications,
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

export default mongoose.model('Specification', Specification);
