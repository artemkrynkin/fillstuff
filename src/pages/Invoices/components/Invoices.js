import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';
import loadable from '@loadable/component';

import CircularProgress from '@material-ui/core/CircularProgress';

import { history } from 'src/helpers/history';

import { getFollowingDates } from 'src/components/Pagination/utils';
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

const generatePaginate = (loadedDocs, data) => {
	const invoices = data.slice();

	invoices.length = loadedDocs < data.length ? loadedDocs : data.length;

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
		filterParams: PropTypes.object.isRequired,
		paging: PropTypes.object.isRequired,
	};

	state = {
		invoice: null,
		dialogOpenedName: '',
		dialogInvoicePaymentCreate: false,
	};

	onLoadOtherDates = () => {
		const { filterParams, paging } = this.props;

		const query = { ...filterParams };

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		const followingDates = getFollowingDates(query.dateStart, query.dateEnd);

		query.dateStart = followingDates.dateStart.valueOf();
		query.dateEnd = followingDates.dateEnd.valueOf();

		history.replace({
			search: queryString.stringify(query),
		});

		this.setState(this.initialState);

		paging.onChangeLoadedDocs(true);
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
		const { filterParams } = this.props;

		const query = { ...filterParams };

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		this.props.getInvoices(query);
	}

	render() {
		const {
			filterParams,
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
					invoiceData.data.length && invoiceData.paging.totalCount ? (
						generatePaginate(paging.loadedDocs, invoiceData.data).map((invoiceDates, index) => (
							<div className={styles.date} key={invoiceDates.date}>
								<div className={styles.dateTitle}>{moment(invoiceDates.date).calendar(null, calendarFormat)}</div>
								{invoiceDates.items.map(invoice => (
									<Invoice key={invoice._id} invoice={invoice} onOpenDialogInvoice={this.onOpenDialogByName} />
								))}
							</div>
						))
					) : !invoiceData.data.length && invoiceData.paging.totalCount ? (
						<div className={styles.none}>
							Среди счетов не найдено совпадений за выбранный период.
							<br />
							Попробуйте изменить запрос.
						</div>
					) : (
						<div className={styles.none}>Еще не выставлено ни одного счета.</div>
					)
				) : null}
				{!isLoadingInvoices && invoiceData && invoiceData.paging.totalCount ? (
					<LoadMoreButton
						loaded={paging.loadedDocs}
						count={invoiceData.data.length}
						textButton="Показать закупки за"
						showDates={true}
						dateStart={filterParams.dateStart}
						dateEnd={filterParams.dateEnd}
						onLoadMore={paging.onChangeLoadedDocs}
						onLoadOtherDates={this.onLoadOtherDates}
					/>
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
		getInvoices: query => dispatch(getInvoices({ query })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
