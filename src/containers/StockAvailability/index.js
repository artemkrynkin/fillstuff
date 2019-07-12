import React, { Component } from 'react';
import { compose } from 'redux';

import generateMetaInfo from 'shared/generate-meta-info';

import Grid from '@material-ui/core/Grid';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { withCurrentUser } from 'src/components/withCurrentUser';

import StockStatus from './components/StockStatus';
import Products from './components/Products';

import './index.styl';

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
						<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
							<Grid item xs={12}>
								<StockStatus currentUser={currentUser} currentStock={currentStock} />
								<Products currentUser={currentUser} currentStock={currentStock} />
							</Grid>
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}

export default compose(withCurrentUser)(StockAvailability);
