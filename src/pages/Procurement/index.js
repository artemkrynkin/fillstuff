import React from 'react';
import { compose } from 'redux';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';
import { LoadingComponent } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./components/index' /* webpackChunkName: "Procurement_Index" */), {
	fallback: <LoadingComponent />,
});

const Procurement = props => {
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

	const {
		match: {
			params: { procurementId },
		},
	} = props;

	const pageParams = {
		backToPage: '/procurements',
	};

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle="Закупки" pageParams={pageParams} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index procurementId={procurementId} />
			</div>
		</div>
	);
};

export default compose(withCurrentUser)(Procurement);
