import mongoose from 'mongoose';
import i18n from 'i18n';

import { dbFillstuff } from 'shared/db';

import { extractHostname } from 'shared/utils';

const Schema = mongoose.Schema;

const Shop = new Schema({
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
		set: value => extractHostname(value),
	},
	__v: {
		type: Number,
		select: false,
	},
});

export default dbFillstuff.model('Shop', Shop);
