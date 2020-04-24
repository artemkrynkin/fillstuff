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
			query: { page, limit, dateStart, dateEnd, member, status },
		} = req.body;

		const conditions = {
			studio: studioId,
		};

		if (dateStart && dateEnd) {
			conditions.createdAt = {
				$gte: new Date(Number(dateStart)),
				$lte: new Date(Number(dateEnd)),
			};
		}

		if (member && member !== 'all') conditions.member = mongoose.Types.ObjectId(member);

		if (status && status !== 'all') conditions.status = status;

		const invoicesPromise = Invoice.paginate(conditions, {
			sort: { createdAt: -1 },
			lean: true,
			populate: [
				{
					path: 'member',
					select: 'user',
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
				{
					path: 'payments.merchant',
					select: 'user',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
			],
			page,
			limit,
			customLabels: {
				docs: 'data',
				meta: 'paging',
			},
		}).catch(err => next({ code: 2, err }));
		const invoicesCountPromise = Invoice.countDocuments({ studio: studioId });

		const invoicesResult = await invoicesPromise;
		const invoicesCount = await invoicesCountPromise;

		let { data: invoices, paging } = invoicesResult;

		invoices.forEach(invoice => {
			if (invoice.payments.length) invoice.payments.reverse();

			invoice.positions = _.chain(invoice.writeOffs)
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

			invoice.positions.sort(
				(writeOffsA, writeOffsB) =>
					writeOffsA.position.name.localeCompare(writeOffsB.position.name) || +writeOffsB.sellingPrice - +writeOffsA.sellingPrice
			);

			delete invoice.writeOffs;
		});

		res.json({
			data: invoices,
			paging: {
				...paging,
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
			.populate([
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
				{
					path: 'payments.merchant',
					select: 'user',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
			])
			.catch(err => next({ code: 2, err }));

		if (invoice.payments.length) invoice.payments.reverse();

		invoice.positions = _.chain(invoice.writeOffs)
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

		invoice.positions.sort((a, b) => a.position.name.localeCompare(b.position.name) || +b.sellingPrice - +a.sellingPrice);

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
				message: 'Выставить счет можно только если есть текущая задолженность.',
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

		const memberEditedPromise = Member.findById(member._id)
			.populate('user', 'avatar name email')
			.catch(err => next({ code: 2, err }));

		const invoicePromise = Invoice.findById(newInvoice._id).catch(err => next({ code: 2, err }));

		const memberEdited = await memberEditedPromise;
		const invoice = await invoicePromise;

		res.json({ member: memberEdited, invoice });
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

		const datePayment = new Date();

		if (invoice.status === 'paid') invoice.datePayment = datePayment;

		invoice.payments.push({
			date: datePayment,
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

		const invoicePayable = await Invoice.findById(invoice._id)
			.lean()
			.populate([
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
				{
					path: 'payments.merchant',
					select: 'user',
					populate: {
						path: 'user',
						select: 'avatar name email',
					},
				},
			])
			.catch(err => next({ code: 2, err }));

		if (invoicePayable.payments.length) invoicePayable.payments.reverse();

		invoicePayable.positions = _.chain(invoicePayable.writeOffs)
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

		invoicePayable.positions.sort((a, b) => a.position.name.localeCompare(b.position.name) || +b.sellingPrice - +a.sellingPrice);

		delete invoicePayable.writeOffs;

		res.json(invoicePayable);
	}
);

export default invoicesRouter;
