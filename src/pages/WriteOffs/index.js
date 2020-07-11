import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { LoadingPage } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { checkQueryInFilter, deleteParamsCoincidence } from 'src/components/Pagination/utils';

import { getWriteOffs } from 'src/actions/writeOffs';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./containers/index' /* webpackChunkName: "WriteOffs_Index" */), {
	fallback: <LoadingPage />,
});

const WriteOffs = props => {
	const { writeOffs } = props;
	const [page, setPage] = useState(1);

	const metaInfo = {
		pageName: 'write-offs',
		pageTitle: 'Списания',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const filterOptions = {
		params: checkQueryInFilter({
			page: 1,
			limit: 150,
			dateStart: null,
			dateEnd: null,
			position: 'all',
			role: 'all',
			onlyCanceled: false,
		}),
		delete: {
			searchByName: ['page', 'limit'],
			searchByValue: [null, '', 'all'],
			serverQueryByValue: [null, '', 'all'],
		},
	};

	useEffect(() => {
		const { params: filterParams, delete: filterDeleteParams } = filterOptions;

		const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

		if (!query.onlyCanceled) delete query.onlyCanceled;

		props.getWriteOffs(query, { emptyData: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index
					writeOffs={writeOffs}
					filterOptions={filterOptions}
					paging={{
						page,
						setPage,
					}}
				/>
			</div>
		</div>
	);
};

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

	if (writeOffsData) {
		// Группируем списания по дням
		const writeOffsDays = _.chain(writeOffsData.data)
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

		// Группируем дни списаний по месяцам
		const writeOffsMonths = _.chain(writeOffsDays)
			.groupBy(writeOffDay => {
				return moment(writeOffDay.date)
					.set({
						date: 1,
						hour: 0,
						minute: 0,
						second: 0,
						millisecond: 0,
					})
					.format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
			})
			.map((days, date) => ({ date, days }))
			.value();

		writeOffs.data = {
			data: writeOffsMonths,
			paging: writeOffsData.paging,
		};
	}

	return {
		writeOffs: writeOffs,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getWriteOffs: (query, options) => dispatch(getWriteOffs({ query, ...options })),
	};
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withCurrentUser)(WriteOffs);
