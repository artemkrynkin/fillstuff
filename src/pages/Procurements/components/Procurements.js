import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import CircularProgress from '@material-ui/core/CircularProgress';

import { deleteParamsCoincidence } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';

import { getProcurementsReceived } from 'src/actions/procurements';

import Procurement from './Procurement';

import styles from './Procurements.module.css';

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
	const procurements = data.slice();

	return _.chain(procurements)
		.groupBy(procurement => {
			return moment(procurement.createdAt)
				.set({
					hour: 0,
					minute: 0,
					second: 0,
					millisecond: 0,
				})
				.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
		})
		.map((procurements, date) => ({ date, procurements }))
		.value();
};

class Procurements extends Component {
	static propTypes = {
		filterOptions: PropTypes.object.isRequired,
		paging: PropTypes.object.isRequired,
	};

	onLoadMore = nextPage => {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = this.props;

		const query = deleteParamsCoincidence({ ...filterParams, page: nextPage }, { type: 'server', ...filterDeleteParams });

		this.props.getProcurementsReceived(query, { showRequest: false, mergeData: true });
	};

	componentDidMount() {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = this.props;

		const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

		this.props.getProcurementsReceived(query);
	}

	render() {
		const {
			filterOptions: { params: filterParams },
			paging,
			procurementsReceived: {
				data: procurementsReceived,
				isFetching: isLoadingProcurementsReceived,
				// error: errorProcurementsDates
			},
		} = this.props;

		return (
			<div className={styles.container}>
				{!isLoadingProcurementsReceived && procurementsReceived ? (
					procurementsReceived.paging.totalCount && procurementsReceived.paging.totalDocs ? (
						<div>
							{brokenDownByMonth(procurementsReceived.data).map(month => (
								<div className={styles.date} key={month.date}>
									<div className={styles.dateTitle}>{moment(month.date).calendar(null, calendarFormat)}</div>
									{month.procurements.map(procurement => (
										<Procurement key={procurement._id} procurement={procurement} filterParams={filterParams} />
									))}
								</div>
							))}
							{procurementsReceived.paging.hasNextPage ? (
								<LoadMoreButton page={paging.page} setPage={paging.setPage} onLoadMore={this.onLoadMore} />
							) : null}
						</div>
					) : procurementsReceived.paging.totalCount && !procurementsReceived.paging.totalDocs ? (
						<div className={styles.none}>Ничего не найдено</div>
					) : (
						<div className={styles.none}>Еще не создано ни одной закупки</div>
					)
				) : isLoadingProcurementsReceived ? (
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				) : null}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		procurementsReceived: state.procurementsReceived,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getProcurementsReceived: (query, params) => dispatch(getProcurementsReceived({ query, ...params })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Procurements);
