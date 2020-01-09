import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';

import CircularProgress from '@material-ui/core/CircularProgress';

import { formatNumber } from 'shared/utils';

import { history } from 'src/helpers/history';

import { getFollowingDates } from 'src/components/Pagination/utils';
import LoadMoreButton from 'src/components/Pagination/LoadMoreButton';

import { getWriteOffs } from 'src/actions/writeOffs';

import WriteOffsPerDay from './WriteOffsPerDay';

import styles from './WriteOffs.module.css';

const generatePaginate = (loadedDocs, data) => {
	const writeOffs = data.slice();

	writeOffs.length = loadedDocs < data.length ? loadedDocs : data.length;

	// Группируем списания по месяцу
	return _.chain(writeOffs)
		.groupBy(writeOffsPerDay => {
			return moment(writeOffsPerDay.date)
				.set({
					date: 1,
					hour: 0,
					minute: 0,
					second: 0,
					millisecond: 0,
				})
				.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
		})
		.map((items, date) => ({
			date,
			items,
		}))
		.value();
};

const momentDate = moment();

const MonthDateTitle = ({ date }) => {
	const isCurrentYear = momentDate.isSame(date, 'year');

	return <div className={styles.dateTitle}>{moment(date).format(isCurrentYear ? 'MMMM' : 'MMMM YYYY')}</div>;
};

class WriteOffs extends Component {
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
			currentStockId,
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
						generatePaginate(paging.loadedDocs, writeOffsData.data).map((writeOffsPerMonth, index) => (
							<div className={styles.date} key={writeOffsPerMonth.date}>
								<MonthDateTitle date={writeOffsPerMonth.date} />
								{writeOffsPerMonth.items.map(writeOffsPerDay => (
									<WriteOffsPerDay key={writeOffsPerDay.date} currentStockId={currentStockId} writeOffsPerDay={writeOffsPerDay} />
								))}
							</div>
						))
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
	const {
		writeOffs: {
			data: writeOffs,
			isFetching: isLoadingWriteOffs,
			// error: errorPositions
		},
	} = state;

	const writeOffsByDay = {
		data: null,
		isFetching: isLoadingWriteOffs,
	};

	if (!isLoadingWriteOffs && writeOffs) {
		// Группируем списания по дню
		const writeOffsByDayData = _.chain(writeOffs.data)
			.groupBy(writeOff => {
				return moment(writeOff.createdAt)
					.set({
						hour: 0,
						minute: 0,
						second: 0,
						millisecond: 0,
					})
					.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
			})
			.map((items, date) => {
				// Считаем данные для индикатора за день
				const indicators = items.reduce(
					(indicators, writeOff) => {
						if (writeOff.canceled) return indicators;

						const purchasePrice = formatNumber(writeOff.quantity * writeOff.receipt.unitPurchasePrice);

						indicators.total += purchasePrice;

						if (!writeOff.isFree) indicators.sellingPositions += purchasePrice;
						else indicators.freePositions += purchasePrice;

						if (!indicators.users.some(user => user._id === writeOff.user._id)) indicators.users.push(writeOff.user);

						return indicators;
					},
					{
						total: 0,
						sellingPositions: 0,
						freePositions: 0,
						users: [],
					}
				);

				return {
					date,
					indicators,
					items,
				};
			})
			.value();

		writeOffsByDay.data = {
			data: writeOffsByDayData,
			paging: writeOffs.paging,
		};
	}

	return {
		writeOffs: writeOffsByDay,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStockId } = ownProps;

	return {
		getWriteOffs: params => dispatch(getWriteOffs(currentStockId, params)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteOffs);
