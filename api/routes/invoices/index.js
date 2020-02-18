import { Router } from 'express';
import _ from 'lodash';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import { formatNumber } from 'shared/utils';

import mongoose from 'mongoose';
import Member from 'api/models/member';
import Invoice from 'api/models/Invoice';

const invoicesRouter = Router();

// const debug = require('debug')('api:products');

invoicesRouter.post(
	'/getInvoices',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			query: { dateStart, dateEnd, member, status },
		} = req.body;

		let conditions = {
			studio: studioId,
		};

		if (dateStart && dateEnd)
			conditions.createdAt = {
				$gte: new Date(Number(dateStart)),
				$lte: new Date(Number(dateEnd)),
			};

		if (member && !/all/.test(member)) conditions.member = mongoose.Types.ObjectId(member);

		if (status && status !== 'all') conditions.status = status;

		const invoicesPromise = Invoice.paginate(conditions, {
			sort: { createdAt: -1 },
			lean: true,
			populate: [
				{
					path: 'member',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
				{
					path: 'writeOffs',
					populate: {
						path: 'position',
						populate: {
							path: 'characteristics',
						},
					},
				},
			],
			pagination: false,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const invoicesCountPromise = Invoice.estimatedDocumentCount();

		const invoices = await invoicesPromise;
		const invoicesCount = await invoicesCountPromise;

		invoices.data.forEach(invoice => {
			invoice.groupedWriteOffs = _.chain(invoice.writeOffs)
				.groupBy(writeOff => {
					return String(writeOff.position._id) && writeOff.unitSellingPrice;
				})
				.map(writeOffs => ({
					position: writeOffs[0].position,
					quantity: writeOffs.reduce((sum, writeOff) => sum + writeOff.quantity, 0),
					unitSellingPrice: writeOffs[0].unitSellingPrice,
					sellingPrice: formatNumber(writeOffs.reduce((sum, writeOff) => sum + writeOff.sellingPrice, 0)),
				}))
				.value();

			const compareByName = (a, b) => {
				if (a.name > b.name) return 1;
				else if (a.name < b.name) return -1;
				else return 0;
			};

			invoice.groupedWriteOffs.sort(compareByName);

			delete invoice.writeOffs;
		});

		res.json({
			data: invoices.data,
			paging: {
				totalCount: invoicesCount,
			},
		});
	}
);

invoicesRouter.post(
	'/getInvoicesMember',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { memberId },
		} = req.body;

		Invoice.find({ studio: studioId, member: memberId }, 'createdAt fromDate toDate status amount')
			.sort('-createdAt')
			.then(invoices => res.json(invoices))
			.catch(err => next({ code: 2, err }));
	}
);

invoicesRouter.post(
	'/getInvoice',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { invoiceId },
		} = req.body;

		const invoice = await Invoice.findById(invoiceId)
			.lean()
			.populate({
				path: 'member',
				populate: {
					path: 'user',
					select: 'avatar name email',
				},
			})
			.populate({
				path: 'writeOffs',
				populate: {
					path: 'position',
					populate: {
						path: 'characteristics',
					},
				},
			})
			.catch(err => next({ code: 2, err }));

		invoice.groupedWriteOffs = _.chain(invoice.writeOffs)
			.groupBy(writeOff => {
				return String(writeOff.position._id) && writeOff.unitSellingPrice;
			})
			.map(writeOffs => ({
				position: writeOffs[0].position,
				quantity: writeOffs.reduce((sum, writeOff) => sum + writeOff.quantity, 0),
				unitSellingPrice: writeOffs[0].unitSellingPrice,
				sellingPrice: formatNumber(writeOffs.reduce((sum, writeOff) => sum + writeOff.sellingPrice, 0)),
			}))
			.value();

		const compareByName = (a, b) => {
			if (a.name > b.name) return 1;
			else if (a.name < b.name) return -1;
			else return 0;
		};

		invoice.groupedWriteOffs.sort(compareByName);

		delete invoice.writeOffs;

		res.json(invoice);
	}
);

invoicesRouter.post(
	'/createInvoice',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			params: { memberId },
		} = req.body;

		const memberPromise = Member.findById(
			memberId,
			'billingFrequency lastBillingDate nextBillingDate billingDebt billingPeriodDebt billingPeriodWriteOffs'
		).catch(err => next({ code: 2, err }));

		const member = await memberPromise;

		if (member.billingPeriodDebt === 0) {
			return res.json({
				code: 7,
				message: 'Выставить счёт можно только если есть списанные платные позиции',
			});
		}

		const newInvoice = new Invoice({
			fromDate: member.lastBillingDate,
			toDate: new Date(),
			studio: studioId,
			member: member._id,
			amount: member.billingPeriodDebt,
			writeOffs: member.billingPeriodWriteOffs,
		});

		const newInvoiceErr = newInvoice.validateSync();

		if (newInvoiceErr) return next({ code: newInvoiceErr.errors ? 5 : 2, err: newInvoiceErr });

		newInvoice.save();

		await Member.findByIdAndUpdate(
			member._id,
			{
				$set: {
					lastBillingDate: newInvoice.toDate,
					billingPeriodDebt: 0,
					billingPeriodWriteOffs: [],
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Member.findById(member._id)
			.populate('user', 'avatar name email')
			.then(member => res.json(member))
			.catch(err => next({ code: 2, err }));
	}
);

invoicesRouter.post(
	'/createInvoicePayment',
	isAuthedResolver,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			memberId,
			params: { invoiceId },
			data: { amount },
		} = req.body;

		const invoice = await Invoice.findById(invoiceId).catch(err => next({ code: 2, err }));
		const member = await Member.findById(invoice.member).catch(err => next({ code: 2, err }));

		if (invoice.status === 'paid') {
			return res.json({
				code: 7,
				message: 'Принять новую оплату по оплаченному счету невозможно',
			});
		}

		const paymentAmountDueOld = invoice.paymentAmountDue;

		invoice.paymentAmountDue += amount;
		invoice.status = invoice.paymentAmountDue >= invoice.amount ? 'paid' : 'partially-paid';

		const paymentAmount = invoice.status !== 'paid' ? amount : invoice.amount - paymentAmountDueOld;

		invoice.payments.push({
			amount: amount,
			merchant: memberId,
		});

		const invoiceErr = invoice.validateSync();

		if (invoiceErr) return next({ code: invoiceErr.errors ? 5 : 2, err: invoiceErr });

		await Promise.all([invoice.save()]);

		const { billingDebt: billingDebtOld } = member;

		await Member.findByIdAndUpdate(
			invoice.member,
			{
				$set: {
					billingDebt: billingDebtOld - paymentAmount,
				},
			},
			{ runValidators: true }
		).catch(err => next({ code: 2, err }));

		Invoice.findById(invoice._id)
			.populate({
				path: 'member',
				populate: {
					path: 'user',
					select: 'avatar name email',
				},
			})
			.populate({
				path: 'writeOffs',
				populate: {
					path: 'position',
					populate: {
						path: 'characteristics',
					},
				},
			})
			.then(invoice => res.json(invoice))
			.catch(err => next({ code: 2, err }));
	}
);

export default invoicesRouter;
