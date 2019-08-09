import React from 'react';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';

import './index.styl';

const StockPurchases = props => {
	const metaInfo = {
		pageName: 'stock-purchases',
		pageTitle: 'Поступления',
	};
	const { title, description } = generateMetaInfo({
		type: metaInfo.pageName,
		data: {
			title: `${metaInfo.pageTitle} - Покупки`,
		},
	});

	return (
		<div className="page__wrap">
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className="page__content stock-purchases"></div>
		</div>
	);
};

export default StockPurchases;
