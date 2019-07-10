import React, { Component } from 'react';
import { compose } from 'redux';

import generateMetaInfo from 'shared/generate-meta-info';

import Grid from '@material-ui/core/Grid';

import Head from 'src/components/head';
import Header from 'src/components/Header';
import { withCurrentUser } from 'src/components/withCurrentUser';

import WriteOffs from './components/WriteOffs';
import Users from './components/Users';

import './index.styl';

class StockWriteOffs extends Component {
	render() {
		const metaInfo = {
			pageName: 'stock-write-offs',
			pageTitle: 'Склад',
		};
		const { title, description } = generateMetaInfo({
			type: metaInfo.pageName,
			data: {
				title: `${metaInfo.pageTitle} - Расход`,
			},
		});

		const {
			currentUser,
			currentStock,
			match: {
				params: { selectedUserId },
			},
		} = this.props;

		const pageParams = {
			selectedUserId,
		};

		return (
			<div className="page__wrap">
				<Head title={title} description={description} />

				<Header pageName={metaInfo.pageName} pageTitle={metaInfo.pageTitle} pageParams={pageParams} />
				<div className="page__content stock-write-offs">
					<div className="page__inner-content">
						<Grid container direction="row" justify="center" alignItems="flex-start" spacing={2}>
							<Grid item xs={12} lg={9}>
								<WriteOffs currentUser={currentUser} currentStock={currentStock} selectedUserId={selectedUserId} />
							</Grid>
							<Grid item xs={12} lg={3}>
								<Users currentUser={currentUser} currentStock={currentStock} />
							</Grid>
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}

export default compose(withCurrentUser)(StockWriteOffs);
