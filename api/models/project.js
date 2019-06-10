import mongoose from 'mongoose';
import validator from 'validator';
import i18n from 'i18n';
import momentTz from 'moment-timezone';

import colorPalette from 'shared/colorPalette';

let Project = new mongoose.Schema({
	name: {
		type: String,
		minlength: [2, i18n.__('Название проекта не может быть короче 2 символов')],
		maxlength: [60, i18n.__('Название проекта не может превышать 60 символов')],
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
	socialPages: [
		{
			_id: false,
			owner: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			pageId: Number,
			url: String,
			name: String,
			photo: String,
			active: {
				type: Boolean,
				default: false,
			},
			network: {
				type: String,
				enum: ['vk'],
			},
		},
	],
	members: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			role: {
				type: String,
				enum: ['owner', 'admin', 'editor', 'author', 'viewer'],
				default: 'viewer',
			},
			invitationCode: String,
			invitationEmail: {
				type: String,
				validate: {
					validator: value => (value ? validator.isEmail(value) : true),
				},
				trim: true,
			},
			isWaiting: Boolean,
		},
	],
	topics: [
		{
			color: {
				type: String,
				enum: colorPalette.topicColors,
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

Project.virtual('project_id').get(function() {
	return this.id;
});

export default mongoose.model('Project', Project);
