import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import { history } from 'src/helpers/history';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { LoadingPage } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import { getProcurementReceived } from 'src/actions/procurements';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./containers/index' /* webpackChunkName: "Procurement_Index" */), {
	fallback: <LoadingPage />,
});

const Procurement = props => {
	const [procurementData, setProcurementData] = useState(null);

	const metaInfo = {
		pageName: 'procurement',
		pageTitle: 'Детали закупки',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const pageParams = {
		backToPage: '/procurements',
	};

	useEffect(() => {
		props.getProcurementReceived().then(response => {
			if (response.status === 'success') {
				setProcurementData(response);
			} else {
				history.push({
					pathname: '/procurements',
				});
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle="Закупки" pageParams={pageParams} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index procurementData={procurementData} />
			</div>
		</div>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const {
		match: {
			params: { procurementId },
		},
	} = ownProps;

	return {
		getProcurementReceived: () => dispatch(getProcurementReceived({ params: { procurementId } })),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Procurement);
