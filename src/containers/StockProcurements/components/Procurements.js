import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';

import CircularProgress from '@material-ui/core/CircularProgress';

import { history } from 'src/helpers/history';

import { getFollowingDates } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';

import { getProcurements } from 'src/actions/procurements';

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

const generatePaginate = (loadedDocs, data) => {
	const procurements = data.slice();

	procurements.length = loadedDocs < data.length ? loadedDocs : data.length;

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
		.map((items, date) => ({ date, items }))
		.value();
};

class Procurements extends Component {
	static propTypes = {
		currentUser: PropTypes.object.isRequired,
		currentStockId: PropTypes.string.isRequired,
		filterParams: PropTypes.object.isRequired,
		paging: PropTypes.object.isRequired,
	};

	onLoadOtherDates = () => {
		const { filterParams, paging } = this.props;

		const queryParams = { ...filterParams };

		Object.keys(queryParams).forEach(key => (queryParams[key] === '' || queryParams[key] === 'all') && delete queryParams[key]);

		const followingDates = getFollowingDates(queryParams.dateStart, queryParams.dateEnd);

		queryParams.dateStart = followingDates.dateStart.valueOf();
		queryParams.dateEnd = followingDates.dateEnd.valueOf();

		history.replace({
			search: queryString.stringify(queryParams),
		});

		this.setState(this.initialState);

		paging.onChangeLoadedDocs(true);
	};

	componentDidMount() {
		const { filterParams } = this.props;

		const queryParams = { ...filterParams };

		Object.keys(queryParams).forEach(key => (queryParams[key] === '' || queryParams[key] === 'all') && delete queryParams[key]);

		this.props.getProcurements(queryParams);
	}

	render() {
		const {
			currentUser,
			filterParams,
			paging,
			procurements: {
				data: procurementData,
				isFetching: isLoadingProcurements,
				// error: errorProcurementsDates
			},
		} = this.props;

		return (
			<div className={styles.container}>
				{!isLoadingProcurements && procurementData ? (
					procurementData.data.length && procurementData.paging.totalCount ? (
						<div>
							{generatePaginate(paging.loadedDocs, procurementData.data).map((procurementDates, index) => (
								<div className={styles.date} key={index}>
									<div className={styles.dateTitle}>{moment(procurementDates.date).calendar(null, calendarFormat)}</div>
									{procurementDates.items.map((procurement, index) => (
										<Procurement key={index} procurement={procurement} currentUser={currentUser} filterParams={filterParams} />
									))}
								</div>
							))}
						</div>
					) : !procurementData.data.length && procurementData.paging.totalCount ? (
						<div className={styles.none}>
							Среди закупок не найдено совпадений за выбранный период.
							<br />
							Попробуйте изменить запрос.
						</div>
					) : (
						<div className={styles.none}>Еще не создано ни одной закупки.</div>
					)
				) : null}
				{!isLoadingProcurements && procurementData && procurementData.paging.totalCount ? (
					<LoadMoreButton
						loaded={paging.loadedDocs}
						count={procurementData.data.length}
						textButton="Показать закупки за"
						showDates={true}
						dateStart={filterParams.dateStart}
						dateEnd={filterParams.dateEnd}
						onLoadMore={paging.onChangeLoadedDocs}
						onLoadOtherDates={this.onLoadOtherDates}
					/>
				) : isLoadingProcurements ? (
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				) : null}
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
	const { currentStockId } = ownProps;

	return {
		getProcurements: params => dispatch(getProcurements(currentStockId, params)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Procurements);
