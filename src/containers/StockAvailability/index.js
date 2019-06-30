import React, { Component } from 'react';
import { compose } from 'redux';

import generateMetaInfo from 'shared/generate-meta-info';

import Grid from '@material-ui/core/Grid';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { withCurrentUser } from 'src/components/withCurrentUser';

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
				title: metaInfo.pageTitle,
			},
		});

		const { currentUser, currentStock, currentCategory } = this.props;

		return (
			<div className="page__wrap">
				<Head title={title} description={description} />

				<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} />
				<div className="page__content stock-availability">
					<div className="page__inner-content">
						<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
							<Grid className="stock-availability__container" item xs={12} lg={9}>
								<Products currentUser={currentUser} currentStock={currentStock} currentCategory={currentCategory} />
							</Grid>
							<Grid className="stock-availability__container" item xs={12} lg={3}>
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
