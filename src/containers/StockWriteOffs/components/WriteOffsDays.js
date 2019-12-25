import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';

import CircularProgress from '@material-ui/core/CircularProgress';

import { history } from 'src/helpers/history';

import { getFollowingDates } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';

import { getWriteOffs } from 'src/actions/writeOffs';

import PeriodIndicators from './PeriodIndicators';
import WriteOffDay from './WriteOffDay';

import styles from './WriteOffsDays.module.css';

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

const generateWriteOffsDays = (loadedDocs, data) => {
	const writeOffsDays = data.slice();

	writeOffsDays.length = loadedDocs < data.length ? loadedDocs : data.length;

	return writeOffsDays;
};

class WriteOffsDays extends Component {
	static propTypes = {
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

		this.props.getWriteOffs(queryParams);
	}

	render() {
		const {
			filterParams,
			paging,
			writeOffs: {
				data: writeOffsData,
				isFetching: isLoadingWriteOffs,
				// error: errorProcurementsDates
			},
		} = this.props;

		return (
			<div className={styles.container}>
				{!isLoadingWriteOffs && writeOffsData ? (
					writeOffsData.data.length && writeOffsData.paging.totalCount ? (
						<div>
							<PeriodIndicators indicators={writeOffsData.indicators} />
							{generateWriteOffsDays(paging.loadedDocs, writeOffsData.data).map((writeOffsDay, index) => (
								<div className={styles.date} key={index}>
									<div className={styles.dateTitle}>{moment(writeOffsDay.date).calendar(null, calendarFormat)}</div>
									<WriteOffDay key={index} date={writeOffsDay.date} indicators={writeOffsDay.indicators} writeOffs={writeOffsDay.items} />
								</div>
							))}
						</div>
					) : !writeOffsData.data.length && writeOffsData.paging.totalCount ? (
						<div className={styles.none}>
							Среди списаний не найдено совпадений за выбранный период.
							<br />
							Попробуйте изменить запрос.
						</div>
					) : (
						<div className={styles.none}>Еще не списано ни одной позиции.</div>
					)
				) : null}
				{!isLoadingWriteOffs && writeOffsData && writeOffsData.paging.totalCount ? (
					<LoadMoreButton
						loaded={paging.loadedDocs}
						count={writeOffsData.data.length}
						textButton="Показать списания за"
						showDates={true}
						dateStart={filterParams.dateStart}
						dateEnd={filterParams.dateEnd}
						onLoadMore={() => paging.onChangeLoadedDocs()}
						onLoadOtherDates={this.onLoadOtherDates}
					/>
				) : isLoadingWriteOffs ? (
					<div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />
				) : null}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		writeOffs: state.writeOffs,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getWriteOffs: params => dispatch(getWriteOffs(currentStockId, params)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteOffsDays);
