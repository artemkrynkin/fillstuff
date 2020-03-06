import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';
import _ from 'lodash';

import CircularProgress from '@material-ui/core/CircularProgress';

import { getFollowingDates, deleteParamsCoincidence } from 'src/components/Pagination/utils';
import LoadMoreButtonDates from 'src/components/Pagination/LoadMoreButtonDates';

import { history } from 'src/helpers/history';

import { getWriteOffs } from 'src/actions/writeOffs';

import WriteOffsPerDay from './WriteOffsPerDay';

import styles from './WriteOffs.module.css';

const generatePaginate = (loadedDocs, data) => {
	const writeOffs = data.slice();

	writeOffs.length = loadedDocs < data.length ? loadedDocs : data.length;

	// Группируем списания по месяцу
	const asdasdasd = _.chain(writeOffs)
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
		.map((days, date) => ({
			date,
			days,
		}))
		.value();

	console.log(asdasdasd);

	return asdasdasd;
};

const momentDate = moment();

const MonthDateTitle = ({ date }) => {
	const isCurrentYear = momentDate.isSame(date, 'year');
	const dateFormat = moment(date).format(isCurrentYear ? 'MMMM' : 'MMMM YYYY');

	return <div className={styles.dateTitle}>{dateFormat}</div>;
};

class WriteOffs extends Component {
	static propTypes = {
		filterOptions: PropTypes.object.isRequired,
	};

	onLoadOtherDates = () => {
		const {
			filterOptions: { params: filterParams },
			paging,
		} = this.props;

		const query = { ...filterParams };

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		if (!query.onlyCanceled) delete query.onlyCanceled;

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
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = this.props;

		const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

		if (!query.onlyCanceled) delete query.onlyCanceled;

		this.props.getWriteOffs(query);
	}

	render() {
		const {
			filterOptions: { params: filterParams },
			paging,
			writeOffs: {
				data: writeOffs,
				isFetching: isLoadingWriteOffs,
				// error: errorWriteOffs
			},
		} = this.props;

		return (
			<div className={styles.container}>
				{!isLoadingWriteOffs && writeOffs ? (
					writeOffs.paging.totalCount && writeOffs.data.length ? (
						<div>
							{generatePaginate(paging.loadedDocs, writeOffs.data).map(months => (
								<div className={styles.date} key={months.date}>
									<MonthDateTitle date={months.date} />
									{months.days.map(writeOffsPerDay => (
										<WriteOffsPerDay key={writeOffsPerDay.date} filterParams={filterParams} writeOffsPerDay={writeOffsPerDay} />
									))}
								</div>
							))}
						</div>
					) : writeOffs.paging.totalCount && !writeOffs.data.length ? (
						<div className={styles.none}>Ничего не найдено</div>
					) : (
						<div className={styles.none}>Еще не списано ни одной позиции.</div>
					)
				) : null}

				{!isLoadingWriteOffs && writeOffs && writeOffs.paging.totalCount ? (
					<LoadMoreButtonDates
						loaded={paging.loadedDocs}
						count={writeOffs.data.length}
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
			data: writeOffsData,
			isFetching: isLoadingWriteOffs,
			// error: errorPositions
		},
	} = state;

	const writeOffs = {
		data: null,
		isFetching: isLoadingWriteOffs,
	};

	if (!isLoadingWriteOffs && writeOffsData) {
		// Группируем списания по дню
		const writeOffsByDayData = _.chain(writeOffsData.data)
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
			.map((writeOffs, date) => {
				// Считаем данные для индикатора за день
				const indicators = writeOffs.reduce(
					(indicators, writeOff) => {
						if (!indicators.members.some(member => member._id === writeOff.member._id)) {
							indicators.members.push(writeOff.member);
						}

						if (writeOff.canceled) return indicators;

						if (!writeOff.isFree) {
							indicators.turnover += writeOff.sellingPrice;
						}

						indicators.expenses += writeOff.purchasePrice;

						return indicators;
					},
					{
						turnover: 0,
						expenses: 0,
						members: [],
					}
				);

				return {
					date,
					indicators,
					writeOffs,
				};
			})
			.value();

		writeOffs.data = {
			data: writeOffsByDayData,
			paging: writeOffsData.paging,
		};
	}

	return {
		writeOffs: writeOffs,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getWriteOffs: (query, params) => dispatch(getWriteOffs({ query, ...params })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteOffs);
