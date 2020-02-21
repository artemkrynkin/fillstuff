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

const Index = loadable(() => import('./components/index' /* webpackChunkName: "Invoice_Index" */), {
	fallback: <LoadingComponent />,
});

const Procurement = props => {
	const metaInfo = {
		pageName: 'invoice',
		pageTitle: 'Детали счета',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	const {
		match: {
			params: { invoiceId },
		},
	} = props;

	const pageParams = {
		backToPage: '/invoices',
	};

	return (
		<div className={stylesPage.pageWrap}>
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle="Счета" pageParams={pageParams} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<div className={styles.wrapper}>
					<Index invoiceId={invoiceId} />
				</div>
			</div>
		</div>
	);
};

export default compose(withCurrentUser)(Procurement);