import { Router } from 'express';

import { isAuthedResolver, hasPermissions } from 'api/utils/permissions';

import Member from 'api/models/member';
import Invoice from 'api/models/Invoice';
import mongoose from 'mongoose';
import Position from '../../models/position';
import Procurement from '../../models/procurement';
import procurementsRouter from '../procurements';

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

		Invoice.findById(invoiceId)
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
			'billingFrequency lastBillingDate nextBillingDate billingDebt billingPeriodWriteOffs'
		).catch(err => next({ code: 2, err }));

		const member = await memberPromise;

		if (member.billingDebt === 0) {
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
			amount: member.billingDebt,
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
					billingDebt: 0,
					billingPeriodWriteOffs: [],
				},
			},
			{ new: true, runValidators: true }
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

		if (invoice.status === 'paid') {
			return res.json({
				code: 7,
				message: 'Принять новую оплату по оплаченному счету невозможно',
			});
		}

		invoice.paymentAmountDue += amount;
		invoice.status = invoice.paymentAmountDue >= invoice.amount ? 'paid' : 'partially-paid';

		invoice.payments.push({
			amount: amount,
			merchant: memberId,
		});

		const invoiceErr = invoice.validateSync();

		if (invoiceErr) return next({ code: invoiceErr.errors ? 5 : 2, err: invoiceErr });

		await Promise.all([invoice.save()]);

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
