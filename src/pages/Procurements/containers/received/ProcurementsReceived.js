import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';

import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';

import Empty from 'src/components/Empty';
import { deleteParamsCoincidence } from 'src/components/Pagination/utils';
import { FilteredComponent } from 'src/components/Loading';

import { getProcurementsReceived } from 'src/actions/procurements';

import ProcurementReceived from './ProcurementReceived';

import styles from './ProcurementsReceived.module.css';

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

const ProcurementsReceived = props => {
	const {
		filterOptions: { params: filterParams },
		paging,
		procurementsReceived: { data: procurementsReceived, isFetching: isLoadingProcurementsReceived },
	} = props;
	const [moreDataLoading, setMoreDataLoading] = useState(false);

	const onLoadMore = nextPage => {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = props;

		const query = deleteParamsCoincidence({ ...filterParams, page: nextPage }, { type: 'server', ...filterDeleteParams });

		setMoreDataLoading(true);

		props.getProcurementsReceived(query, { showRequest: false, mergeData: true }).then(() => {
			setMoreDataLoading(false);
		});
	};

	if (!procurementsReceived.data.length || !procurementsReceived.paging.totalDocs) {
		return (
			<FilteredComponent loading={isLoadingProcurementsReceived}>
				<Empty
					classNames={{
						container: styles.empty,
					}}
					imageSrc={searchNotFound}
					content={
						<Fragment>
							<Typography variant="h6" gutterBottom>
								Ничего не нашлось
							</Typography>
							<Typography variant="body1" gutterBottom>
								Попробуйте изменить параметры поиска
							</Typography>
						</Fragment>
					}
				/>
			</FilteredComponent>
		);
	}

	return (
		<FilteredComponent loading={isLoadingProcurementsReceived}>
			{procurementsReceived.data.map(month => (
				<div className={styles.date} key={month.date}>
					<div className={styles.dateTitle}>{moment(month.date).calendar(null, calendarFormat)}</div>
					{month.procurements.map(procurement => (
						<ProcurementReceived key={procurement._id} procurement={procurement} filterParams={filterParams} />
					))}
				</div>
			))}
			{procurementsReceived.paging.hasNextPage ? (
				<LoadMoreButton page={paging.page} setPage={paging.setPage} onLoadMore={onLoadMore} loading={moreDataLoading} />
			) : null}
		</FilteredComponent>
	);
};

ProcurementsReceived.propTypes = {
	filterOptions: PropTypes.object.isRequired,
	paging: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
	return {
		getProcurementsReceived: (query, options) => dispatch(getProcurementsReceived({ query, ...options })),
	};
};

export default connect(null, mapDispatchToProps)(ProcurementsReceived);
