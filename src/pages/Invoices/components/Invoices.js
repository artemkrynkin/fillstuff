import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import loadable from '@loadable/component';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { deleteParamsCoincidence } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';
import { LoadingComponent } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import { getInvoices } from 'src/actions/invoices';

import Invoice from './Invoice';

import styles from './Invoices.module.css';

import emptyImage from 'public/img/stubs/procurements.svg';

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

const brokenDownByMonth = data => {
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
		.map((invoices, date) => ({ date, invoices }))
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

		this.props.getInvoices(query, { mergeData: true });
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

		if (!invoiceData) return <LoadingComponent className={styles.container} />;

		if (!invoiceData.paging.totalCount && !invoiceData.paging.totalDocs) {
			return (
				<Empty
					className={styles.empty}
					imageSrc={emptyImage}
					content={
						<Typography variant="h6" gutterBottom>
							Похоже, у вас еще нет выставленных счетов
						</Typography>
					}
					actions={
						<Button variant="contained" color="primary">
							Выставить счет
						</Button>
					}
				/>
			);
		}

		if (invoiceData.paging.totalCount && !invoiceData.paging.totalDocs) {
			return (
				<Empty
					content={
						<Typography variant="h6" gutterBottom>
							Ничего не найдено
						</Typography>
					}
					style={{ marginTop: 16 }}
				/>
			);
		}

		if (invoiceData.paging.totalCount && invoiceData.paging.totalDocs) {
			return (
				<div className={styles.container}>
					{brokenDownByMonth(invoiceData.data).map(month => (
						<div className={styles.date} key={month.date}>
							<div className={styles.dateTitle}>{moment(month.date).calendar(null, calendarFormat)}</div>
							{month.invoices.map(invoice => (
								<Invoice key={invoice._id} invoice={invoice} onOpenDialogInvoice={this.onOpenDialogByName} />
							))}
						</div>
					))}
					{invoiceData.paging.hasNextPage ? (
						<LoadMoreButton page={paging.page} setPage={paging.setPage} onLoadMore={this.onLoadMore} loading={isLoadingInvoices} />
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

		return null;
	}
}

const mapStateToProps = state => {
	return {
		invoices: state.invoices,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getInvoices: (query, options) => dispatch(getInvoices({ query, ...options })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
