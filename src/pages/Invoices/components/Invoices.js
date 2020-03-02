import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import loadable from '@loadable/component';

import CircularProgress from '@material-ui/core/CircularProgress';

import { deleteParamsCoincidence } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';

import { getInvoices } from 'src/actions/invoices';

import Invoice from './Invoice';

import styles from './Invoices.module.css';

const calendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	lastDay: 'Вчера',
	sameElse: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
	nextWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
	lastWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
};

const generatePaginate = data => {
	const invoices = data.slice();

	return _.chain(invoices)
		.groupBy(invoice => {
			return moment(invoice.createdAt)
				.set({
					hour: 0,
					minute: 0,
					second: 0,
					millisecond: 0,
				})
				.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
		})
		.map((items, date) => ({ date, items }))
		.value();
};

const DialogInvoicePaymentCreate = loadable(() =>
	import('src/pages/Dialogs/InvoicePaymentCreate' /* webpackChunkName: "Dialog_InvoicePaymentCreate" */)
);

class Invoices extends Component {
	static propTypes = {
		filterOptions: PropTypes.object.isRequired,
		paging: PropTypes.object.isRequired,
	};

	state = {
		invoice: null,
		dialogOpenedName: '',
		dialogInvoicePaymentCreate: false,
	};

	onLoadMore = nextPage => {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = this.props;

		const query = deleteParamsCoincidence({ ...filterParams, page: nextPage }, { type: 'server', ...filterDeleteParams });

		this.props.getInvoices(query, { showRequest: false, mergeData: true });
	};

	onInvoiceDrop = () => this.setState({ invoice: null, dialogOpenedName: '' });

	onOpenDialogByName = (dialogName, invoice) =>
		this.setState({
			invoice: invoice,
			dialogOpenedName: dialogName,
			[dialogName]: true,
		});

	onCloseDialogByName = dialogName => this.setState({ [dialogName]: false });

	componentDidMount() {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = this.props;

		const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

		this.props.getInvoices(query);
	}

	render() {
		const {
			paging,
			invoices: {
				data: invoiceData,
				isFetching: isLoadingInvoices,
				// error: errorInvoicesDates
			},
		} = this.props;
		const { invoice, dialogOpenedName, dialogInvoicePaymentCreate } = this.state;

		return (
			<div className={styles.container}>
				{!isLoadingInvoices && invoiceData ? (
					invoiceData.paging.totalCount && invoiceData.paging.totalDocs ? (
						<div>
							{generatePaginate(invoiceData.data).map((invoiceDates, index) => (
								<div className={styles.date} key={invoiceDates.date}>
									<div className={styles.dateTitle}>{moment(invoiceDates.date).calendar(null, calendarFormat)}</div>
									{invoiceDates.items.map(invoice => (
										<Invoice key={invoice._id} invoice={invoice} onOpenDialogInvoice={this.onOpenDialogByName} />
									))}
								</div>
							))}
							{invoiceData.paging.hasNextPage ? (
								<LoadMoreButton page={paging.page} setPage={paging.setPage} onLoadMore={this.onLoadMore} />
							) : null}
						</div>
					) : invoiceData.paging.totalCount && !invoiceData.paging.totalDocs ? (
						<div className={styles.none}>Ничего не найдено</div>
					) : (
						<div className={styles.none}>Еще не выставлено ни одного счета.</div>
					)
				) : isLoadingInvoices ? (
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				) : null}

				<DialogInvoicePaymentCreate
					dialogOpen={dialogInvoicePaymentCreate}
					onCloseDialog={() => this.onCloseDialogByName('dialogInvoicePaymentCreate')}
					onExitedDialog={this.onInvoiceDrop}
					selectedInvoice={dialogOpenedName === 'dialogInvoicePaymentCreate' ? invoice : null}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		invoices: state.invoices,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getInvoices: (query, params) => dispatch(getInvoices({ query, ...params })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
