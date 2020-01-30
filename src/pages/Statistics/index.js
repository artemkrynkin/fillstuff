import React from 'react';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';

import stylesPage from 'src/styles/page.module.css';

const Statistics = () => {
	const metaInfo = {
		pageName: 'statistics',
		pageTitle: 'Статистика',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className={stylesPage.pageWrap}>
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className={stylesPage.pageContent}>
				<div className={`${stylesPage.pageContent}`}></div>
			</div>
		</div>
	);
};

export default Statistics;
