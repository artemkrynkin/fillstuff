import React from 'react';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import HeaderPage from 'src/components/HeaderPage';

import stylesPage from 'src/styles/page.module.css';

const Dashboard = props => {
	const metaInfo = {
		pageName: 'dashboard',
		pageTitle: 'Монитор',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className={stylesPage.page}>
			<Head title={title} description={description} />

			<HeaderPage pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={stylesPage.pageContent}>
				<div className={`${stylesPage.pageContent}`}></div>
			</div>
		</div>
	);
};

export default Dashboard;
