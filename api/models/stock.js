import mongoose from 'mongoose';
import validator from 'validator';
import i18n from 'i18n';
import momentTz from 'moment-timezone';

import colorPalette from 'shared/colorPalette';

let Stock = new mongoose.Schema({
	name: {
		type: String,
		minlength: [2, i18n.__('Название склада не может быть короче 2 символов')],
		maxlength: [60, i18n.__('Название склада не может превышать 60 символов')],
		required: [true, i18n.__('Обязательное поле')],
		trim: true,
	},
	timezone: {
		type: String,
		default: !!~require('shared/timezones').indexOf(momentTz.tz.guess()) ? momentTz.tz.guess() : '',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	members: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			role: {
				type: String,
				enum: ['owner', 'admin', 'user'],
				default: 'user',
			},
			invitationCode: String,
			invitationEmail: {
				type: String,
				validate: {
					validator: value => (value ? validator.isEmail(value) : true),
				},
				trim: true,
			},
			invitationName: {
				type: String,
				trim: true,
			},
			isWaiting: Boolean,
		},
	],
	categories: [
		{
			color: {
				type: String,
				enum: colorPalette.colorsCategories,
				required: true,
			},
			name: {
				type: String,
				minlength: 1,
				maxlength: 50,
				required: true,
				trim: true,
			},
		},
	],
});

export default mongoose.model('Stock', Stock);
