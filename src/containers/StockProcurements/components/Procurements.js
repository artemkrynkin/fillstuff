import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';

import CircularProgress from '@material-ui/core/CircularProgress';

import { history } from 'src/helpers/history';

import { getFollowingDates } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';

import { getProcurements } from 'src/actions/procurements';

import filterSchema from './filterSchema';
import Procurement from './Procurement';

import styles from './Procurements.module.css';

const calendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	nextWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
	lastDay: 'Вчера',
	lastWeek: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
	sameElse: function(now) {
		return this.isSame(now, 'year') ? 'D MMMM, dddd' : 'D MMMM YYYY';
	},
};

const generateProcurementGrouped = (loadedDocs, data) => {
	const procurements = data.slice();

	procurements.length = loadedDocs < data.length ? loadedDocs : data.length;

	return _.chain(procurements)
		.groupBy(procurement => {
			const momentDate = moment(procurement.createdAt).set({
				hour: 0,
				minute: 0,
				second: 0,
				millisecond: 0,
			});

			return momentDate.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
		})
		.map((value, key) => ({ date: key, procurements: value }))
		.value();
};

class Procurements extends Component {
	onLoadOtherDates = () => {
		const { queryParams, paging } = this.props;

		const filterParams = filterSchema.cast(Object.assign({}, queryParams));

		Object.keys(filterParams).forEach(key => filterParams[key] === '' && delete filterParams[key]);

		const followingDates = getFollowingDates(filterParams.dateStart, filterParams.dateEnd);

		filterParams.dateStart = followingDates.dateStart.valueOf();
		filterParams.dateEnd = followingDates.dateEnd.valueOf();

		history.replace({
			search: queryString.stringify(filterParams),
		});

		this.setState(this.initialState);

		paging.onChangeLoadedDocs(true);
	};

	componentDidMount() {
		this.props.getProcurements();
	}

	render() {
		const {
			// currentStock,
			currentUser,
			queryParams,
			paging,
			procurements: {
				data: procurementData,
				isFetching: isLoadingProcurements,
				// error: errorProcurementsDates
			},
		} = this.props;

		return (
			<div className={styles.procurements}>
				{!isLoadingProcurements && procurementData ? (
					procurementData.data.length && procurementData.paging.totalCount ? (
						<div>
							{generateProcurementGrouped(paging.loadedDocs, procurementData.data).map((procurementDates, index) => (
								<div className={styles.procurementDate} key={index}>
									<div className={styles.procurementDateTitle}>{moment(procurementDates.date).calendar(null, calendarFormat)}</div>
									{procurementDates.procurements.map((procurement, index) => (
										<Procurement key={index} procurement={procurement} currentUser={currentUser} queryParams={queryParams} />
									))}
								</div>
							))}
						</div>
					) : !procurementData.data.length && procurementData.paging.totalCount ? (
						<div className={styles.procurementsNone}>
							Среди закупок не найдено совпадений за выбранный период.
							<br />
							Попробуйте изменить запрос.
						</div>
					) : (
						<div className={styles.procurementsNone}>Еще не создано ни одной закупки.</div>
					)
				) : null}
				{!isLoadingProcurements && procurementData && procurementData.paging.totalCount ? (
					<LoadMoreButton
						loaded={paging.loadedDocs}
						count={procurementData.data.length}
						dateStart={queryParams.dateStart}
						dateEnd={queryParams.dateEnd}
						onLoadMore={() => paging.onChangeLoadedDocs()}
						onLoadOtherDates={this.onLoadOtherDates}
					/>
				) : (
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		procurements: state.procurements,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock, queryParams } = ownProps;

	const filterParams = filterSchema.cast(Object.assign({}, queryParams));

	Object.keys(filterParams).forEach(key => filterParams[key] === '' && delete filterParams[key]);

	return {
		getProcurements: params => dispatch(getProcurements(currentStock._id, params || filterParams)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Procurements);
