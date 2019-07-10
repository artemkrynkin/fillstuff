import React, { Component } from 'react';
import { compose } from 'redux';

import generateMetaInfo from 'shared/generate-meta-info';

import Grid from '@material-ui/core/Grid';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { withCurrentUser } from 'src/components/withCurrentUser';

import StockStatus from './components/StockStatus';
import Products from './components/Products';
import Categories from './components/Categories';

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

		const {
			currentUser,
			currentStock,
			match: {
				params: { selectedCategoryId },
			},
		} = this.props;

		const pageParams = {
			selectedCategoryId,
		};

		return (
			<div className="page__wrap">
				<Head title={title} description={description} />

				<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} pageParams={pageParams} />
				<div className="page__content stock-availability">
					<div className="page__inner-content">
						<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
							<Grid item xs={12} lg={9}>
								<StockStatus currentUser={currentUser} currentStock={currentStock} />
								<Products currentUser={currentUser} currentStock={currentStock} selectedCategoryId={selectedCategoryId} />
							</Grid>
							<Grid item xs={12} lg={3}>
								<Categories currentUser={currentUser} currentStock={currentStock} />
							</Grid>
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}

export default compose(withCurrentUser)(StockAvailability);
