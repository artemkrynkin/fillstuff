import React from 'react';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';

const StockStatistics = () => {
	const metaInfo = {
		pageName: 'stock-statistics',
		pageTitle: 'Статистика',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: metaInfo.pageTitle,
		},
	});

	return (
		<div className="page__wrap">
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className="page__content">
				<div className="page__inner-content">Statistics</div>
			</div>
		</div>
	);
};

export default StockStatistics;
