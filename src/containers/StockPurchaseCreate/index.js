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

const Index = loadable(() => import('./components/index' /* webpackChunkName: "StockPurchaseCreate_Index" */), {
	fallback: <LoadingComponent />,
});

const StockPurchaseCreate = props => {
	const metaInfo = {
		pageName: 'stock-purchase-create',
		pageTitle: 'Покупки',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: `${metaInfo.pageTitle} - Создание покупки`,
		},
	});

	const { currentUser, currentStock } = props;

	const pageParams = {
		backToPage: -1,
	};

	return (
		<div className={stylesPage.pageWrap}>
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} pageParams={pageParams} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<div className={styles.wrapper}>
					<Index currentUser={currentUser} currentStock={currentStock} />
				</div>
			</div>
		</div>
	);
};

export default compose(withCurrentUser)(StockPurchaseCreate);
