import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import loadable from '@loadable/component';
import _ from 'lodash';
import moment from 'moment';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { LoadingPage } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { checkQueryInFilter, deleteParamsCoincidence } from 'src/components/Pagination/utils';

import { getProcurementsExpected, getProcurementsReceived } from 'src/actions/procurements';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./containers/index' /* webpackChunkName: "Procurements_Index" */), {
	fallback: <LoadingPage />,
});

const Procurements = props => {
	const { currentStudio, procurementsExpected, procurementsReceived } = props;
	const [page, setPage] = useState(1);

	const metaInfo = {
		pageName: 'procurements',
		pageTitle: 'Закупки',
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
			limit: 10,
			dateStart: null,
			dateEnd: null,
			invoiceNumber: '',
			position: 'all',
			member: 'all',
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

		props.getProcurementsExpected({ emptyData: true });
		props.getProcurementsReceived(query, { emptyData: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index
					currentStudio={currentStudio}
					procurementsExpected={procurementsExpected}
					procurementsReceived={procurementsReceived}
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
		procurementsReceived: {
			data: procurementsReceivedData,
			isFetching: isLoadingProcurementsReceived,
			// error: errorPositions
		},
	} = state;

	const procurementsReceived = {
		data: null,
		isFetching: isLoadingProcurementsReceived,
	};

	if (procurementsReceivedData) {
		// Группируем закупки по дням
		const procurementsDays = _.chain(procurementsReceivedData.data)
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

		procurementsReceived.data = {
			data: procurementsDays,
			paging: procurementsReceivedData.paging,
		};
	}

	return {
		procurementsExpected: state.procurementsExpected,
		procurementsReceived: procurementsReceived,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getProcurementsExpected: options => dispatch(getProcurementsExpected({ ...options })),
		getProcurementsReceived: (query, options) => dispatch(getProcurementsReceived({ query, ...options })),
	};
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withCurrentUser)(Procurements);
