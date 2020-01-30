import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import i18n from 'i18n';

import { formatNumber } from 'shared/utils';

const Schema = mongoose.Schema;

let WriteOff = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	studio: {
		type: Schema.Types.ObjectId,
		ref: 'Studio',
		required: [true, i18n.__('Обязательное поле')],
		select: false,
	},
	position: {
		type: Schema.Types.ObjectId,
		ref: 'Position',
		required: [true, i18n.__('Обязательное поле')],
	},
	receipt: {
		type: Schema.Types.ObjectId,
		ref: 'Receipt',
		required: [true, i18n.__('Обязательное поле')],
	},
	member: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
		required: [true, i18n.__('Обязательное поле')],
	},
	// списание за счет студии
	purchaseExpenseStudio: {
		type: Boolean,
		default: false,
	},
	// если списание отменено, то true, иначе false
	canceled: {
		type: Boolean,
		default: false,
	},
	// Дата отмены списания
	canceledDate: Date,
	// Запрос на отмену от
	cancellationRequestBy: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
	},
	// Если списание бесплатное, то true, иначе false
	isFree: {
		type: Boolean,
		default: false,
	},
	// Статус оплаты
	paymentStatus: {
		type: String,
		enum: ['paid', 'unpaid'],
	},
	// Дата оплаты
	paymentDate: Date,
	// Участник с правами администратора принявший оплату за счет
	merchant: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
	},
	// Количество
	quantity: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		required: [true, i18n.__('Обязательное поле')],
	},
	// Общая сумма покупки
	totalPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	// Общая итоговая цена продажи (со всеми накрутками)
	totalPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	// Итоговая цена продажи единицы (со всеми накрутками)
	unitTotalPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	// Цена покупки единицы
	unitPurchasePrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	// Цена продажи единицы
	unitSellingPrice: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	// Накрутка единицы
	unitExtraCharge: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	// Ручная накрутка единицы
	unitManualExtraCharge: {
		type: Number,
		min: [0, 'Не может быть меньше 0'],
		default: 0,
		set: value => formatNumber(value),
	},
	__v: {
		type: Number,
		select: false,
	},
});

WriteOff.plugin(mongoosePaginate);

export default mongoose.model('WriteOff', WriteOff);
