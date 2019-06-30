import React, { Component } from 'react';
import { compose } from 'redux';

import generateMetaInfo from 'shared/generate-meta-info';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { withCurrentUser } from 'src/components/withCurrentUser';

import './index.styl';

class StockCosts extends Component {
	render() {
		const metaInfo = {
			pageName: 'stock-costs',
			pageTitle: 'Склад',
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
				<div className="page__content stock-availability">
					<div className="page__inner-content">123</div>
				</div>
			</div>
		);
	}
}

export default compose(withCurrentUser)(StockCosts);
