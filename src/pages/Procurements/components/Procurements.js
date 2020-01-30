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
		currentStudioId: PropTypes.string.isRequired,
		filterParams: PropTypes.object.isRequired,
		paging: PropTypes.object.isRequired,
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

	componentDidMount() {
		const { filterParams } = this.props;

		const query = { ...filterParams };

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		this.props.getProcurements(query);
	}

	render() {
		const {
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
						generatePaginate(paging.loadedDocs, procurementData.data).map((procurementDates, index) => (
							<div className={styles.date} key={procurementDates.date}>
								<div className={styles.dateTitle}>{moment(procurementDates.date).calendar(null, calendarFormat)}</div>
								{procurementDates.items.map(procurement => (
									<Procurement key={procurement._id} procurement={procurement} filterParams={filterParams} />
								))}
							</div>
						))
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

const mapDispatchToProps = dispatch => {
	return {
		getProcurements: query => dispatch(getProcurements({ query })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Procurements);
