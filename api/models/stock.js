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
				required: [true, i18n.__('Обязательное поле')],
			},
			name: {
				type: String,
				minlength: [1, i18n.__('Название категории не может быть короче 1 символа')],
				maxlength: [50, i18n.__('Название категории не может превышать 50 символов')],
				required: [true, i18n.__('Обязательное поле')],
				trim: true,
			},
		},
	],
	productSpecifications: {
		names: [
			{
				name: {
					type: String,
					required: [true, i18n.__('Обязательное поле')],
				},
				label: {
					type: String,
					required: [true, i18n.__('Обязательное поле')],
				},
			},
		],
		values: [
			{
				specificationName: {
					type: String,
					required: [true, i18n.__('Обязательное поле')],
				},
				value: {
					type: String,
					required: [true, i18n.__('Обязательное поле')],
				},
			},
		],
	},
});

export default mongoose.model('Stock', Stock);
