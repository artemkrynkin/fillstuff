import mongoose from 'mongoose';
import validator from 'validator';
import i18n from 'i18n';
import momentTz from 'moment-timezone';

import colorPalette from 'shared/colorPalette';

const Schema = mongoose.Schema;

let Stock = new Schema({
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
	status: {
		numberProducts: {
			type: Number,
			default: 0,
		},
		unitsProduct: {
			type: Number,
			default: 0,
		},
		stockCost: {
			type: Number,
			default: 0,
		},
	},
	members: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
			role: {
				type: String,
				enum: ['owner', 'admin', 'user'],
				default: 'user',
			},
			isWaiting: Boolean,
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	categories: [
		{
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
		names: {
			type: [
				{
					value: {
						type: String,
						required: [true, i18n.__('Обязательное поле')],
						lowercase: true,
						trim: true,
					},
					label: {
						type: String,
						required: [true, i18n.__('Обязательное поле')],
					},
				},
			],
			default: [
				{
					value: 'manufacturer',
					label: 'Производитель',
				},
				{
					value: 'marking',
					label: 'Маркировка',
				},
				{
					value: 'color',
					label: 'Цвет',
				},
				{
					value: 'volume',
					label: 'Объем',
				},
				{
					value: 'size',
					label: 'Размер',
				},
				{
					value: 'thickness',
					label: 'Толщина',
				},
				{
					value: 'diameter',
					label: 'Диаметр',
				},
				{
					value: 'material',
					label: 'Материал',
				},
			],
		},
		values: [
			{
				parentId: {
					type: Schema.Types.ObjectId,
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
				},
			},
		],
	},
	productShops: [
		{
			value: {
				type: String,
				required: [true, i18n.__('Обязательное поле')],
				lowercase: true,
				trim: true,
			},
			label: {
				type: String,
				required: [true, i18n.__('Обязательное поле')],
			},
			url: String,
		},
	],
});

export default mongoose.model('Stock', Stock);
