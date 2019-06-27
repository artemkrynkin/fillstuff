import React from 'react';
import { compose } from 'redux';
import Loadable from 'react-loadable';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { DisplayLoadingComponent } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import './index.styl';

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
		<div className="page__wrap">
			<Head title={title} description={description} />

			<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
			<div className="page__content stock-settings">
				<div className="page__inner-content">
					<Index currentUser={currentUser} currentStock={currentStock} />
				</div>
			</div>
		</div>
	);
};

export default compose(withCurrentUser)(StockSettings);
