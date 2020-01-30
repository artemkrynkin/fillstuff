import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
import validator from 'validator';
import { pbkdf2Sync, randomBytes } from 'crypto';
import i18n from 'i18n';

const Schema = mongoose.Schema;

let User = new Schema({
	avatar: {
		type: String,
		default: null,
	},
	name: {
		type: String,
		maxlength: [60, i18n.__('Имя не может быть длинее 60 символов')],
		trim: true,
		default: '',
	},
	email: {
		type: String,
		validate: {
			validator: value => (value ? validator.isEmail(value) : true),
			message: () => i18n.__('Некорректный Email'),
		},
		default: null,
		trim: true,
	},
	passwordUpdate: Date,
	hasPassword: {
		type: Boolean,
		default: false,
	},
	hashedPassword: String,
	salt: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	modifiedAt: {
		type: Date,
		default: Date.now,
	},
	activeStudio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
	},
	activeMember: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
	},
	__v: {
		type: Number,
		select: false,
	},
});

if (!User.options.toObject) User.options.toObject = {};
User.options.toObject.transform = function(user, ret, options) {
	if (options.deleteConfidentialData) {
		delete ret.salt;
		delete ret.hashedPassword;
	}

	return ret;
};

User.methods.encryptPassword = function(password) {
	//return createHmac('sha1', this.salt).update(password).digest('hex');
	return pbkdf2Sync(password, this.salt, 10000, 512, 'sha1').toString('hex');
};

User.methods.checkPassword = function(password) {
	return this.salt && this.hashedPassword ? this.encryptPassword(password) === this.hashedPassword : false;
};

User.virtual('password')
	.set(function(password) {
		this._plainPassword = password;
		this.salt = randomBytes(256).toString('hex');
		this.hashedPassword = this.encryptPassword(password);
		this.hasPassword = true;
		this.passwordUpdate = Date.now();
	})
	.get(function() {
		return this._plainPassword;
	});

User.plugin(findOrCreate);

export const UserSchema = User;
export default mongoose.model('User', User);
