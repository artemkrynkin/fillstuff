import React, { Component } from 'react';
import { compose } from 'redux';
import Loadable from 'react-loadable';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { DisplayLoadingComponent } from 'src/components/Loading';
import { withCurrentUser } from 'src/components/withCurrentUser';

import './index.styl';

const Index = Loadable({
	loader: () => import('./components/index' /* webpackChunkName: "StockAvailability_Index" */),
	loading: DisplayLoadingComponent,
	delay: 200,
});

class StockAvailability extends Component {
	render() {
		const metaInfo = {
			pageName: 'stock-availability',
			pageTitle: 'Склад',
		};
		const { title, description } = generateMetaInfo({
			type: metaInfo.pageName,
			data: {
				title: `${metaInfo.pageTitle} - Наличие`,
			},
		});

		const { currentUser, currentStock } = this.props;

		return (
			<div className="page__wrap">
				<Head title={title} description={description} />

				<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
				<div className="page__content stock-availability">
					<div className="page__inner-content">
						<Index currentUser={currentUser} currentStock={currentStock} />
					</div>
				</div>
			</div>
		);
	}
}

export default compose(withCurrentUser)(StockAvailability);
