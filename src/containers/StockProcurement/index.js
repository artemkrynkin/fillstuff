import React from 'react';
import { compose } from 'redux';
import loadable from '@loadable/component';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { LoadingComponent } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = loadable(() => import('./components/index' /* webpackChunkName: "StockProcurement_Index" */), {
	fallback: <LoadingComponent />,
});

const StockProcurement = props => {
	const metaInfo = {
		pageName: 'stock-procurement',
		pageTitle: 'Детали закупки',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const {
		currentUser,
		currentStock,
		match: {
			params: { procurementId },
		},
	} = props;

	const pageParams = {
		backToPage: `/stocks/${currentUser.activeStockId}/procurements`,
	};

	return (
		<div className={stylesPage.pageWrap}>
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle="Закупки" pageParams={pageParams} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<div className={styles.wrapper}>
					<Index currentUser={currentUser} currentStock={currentStock} procurementId={procurementId} />
				</div>
			</div>
		</div>
	);
};

export default compose(withCurrentUser)(StockProcurement);