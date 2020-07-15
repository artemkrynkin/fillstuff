import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';

import { deleteParamsCoincidence } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';
import { FilteredComponent } from 'src/components/Loading';
import Empty from 'src/components/Empty';

import { getInvoices } from 'src/actions/invoices';

import Invoice from './Invoice';

import styles from './Invoices.module.css';

import Filter from './Filter';

import searchNotFound from 'public/img/stubs/search_not_found.svg';

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

const Invoices = props => {
	const {
		filterOptions,
		paging,
		onOpenDialogByName,
		invoices: { data: invoices, isFetching: isLoadingInvoices },
	} = props;
	const [moreDataLoading, setMoreDataLoading] = useState(false);

	const onLoadMore = nextPage => {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = props;

		const query = deleteParamsCoincidence({ ...filterParams, page: nextPage }, { type: 'server', ...filterDeleteParams });

		setMoreDataLoading(true);

		props.getInvoices(query, { showRequest: false, mergeData: true }).then(() => {
			setMoreDataLoading(false);
		});
	};

	if (!invoices.paging.totalDocs) {
		return (
			<Fragment>
				<Filter filterOptions={filterOptions} paging={paging} />
				<FilteredComponent loading={isLoadingInvoices}>
					<Empty
						classNames={{
							container: styles.empty,
						}}
						imageSrc={searchNotFound}
						content={
							<div>
								<Typography variant="h6" gutterBottom>
									Ничего не нашлось
								</Typography>
								<Typography variant="body1" gutterBottom>
									Попробуйте изменить параметры поиска
								</Typography>
							</div>
						}
					/>
				</FilteredComponent>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<Filter filterOptions={filterOptions} paging={paging} />
			<FilteredComponent loading={isLoadingInvoices}>
				{invoices.data.map(month => (
					<div className={styles.date} key={month.date}>
						<div className={styles.dateTitle}>{moment(month.date).calendar(null, calendarFormat)}</div>
						{month.invoices.map(invoice => (
							<Invoice
								key={invoice._id}
								invoice={invoice}
								onOpenDialogInvoice={() => onOpenDialogByName('dialogInvoicePaymentCreate', 'invoice', invoice)}
							/>
						))}
					</div>
				))}
				{invoices.paging.hasNextPage ? (
					<LoadMoreButton page={paging.page} setPage={paging.setPage} onLoadMore={onLoadMore} loading={moreDataLoading} />
				) : null}
			</FilteredComponent>
		</Fragment>
	);
};

Invoices.propTypes = {
	filterOptions: PropTypes.object.isRequired,
	paging: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		getInvoices: (query, options) => dispatch(getInvoices({ query, ...options })),
	};
};

export default connect(null, mapDispatchToProps)(Invoices);
