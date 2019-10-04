import React from 'react';
import { compose } from 'redux';
import Loadable from 'react-loadable';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { DisplayLoadingComponent } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

const Index = Loadable({
	loader: () => import('./components/index' /* webpackChunkName: "StockSettings_Index" */),
	loading: DisplayLoadingComponent,
	delay: 200,
});

const StockSettings = props => {
	const metaInfo = {
		pageName: 'stock-settings',
		pageTitle: 'Настройки',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const { currentUser, currentStock } = props;

	return (
		<div className={stylesPage.pageWrap}>
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<div className={styles.wrapper}>
					<Index currentUser={currentUser} currentStock={currentStock} />
				</div>
			</div>
		</div>
	);
};

export default compose(withCurrentUser)(StockSettings);
