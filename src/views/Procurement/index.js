import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import history from 'src/helpers/history';

import Layout from 'src/components/Layout';
import HeaderPage from 'src/components/HeaderPage';
import { withCurrentUser } from 'src/components/withCurrentUser';

import { getProcurementReceived } from 'src/actions/procurements';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

import Index from './containers/index';

const Procurement = props => {
	const [procurementData, setProcurementData] = useState(null);

	const layoutMetaInfo = {
		pageName: 'procurement',
		pageTitle: 'Детали закупки',
	};

	const pageParams = {
		backToPage: '/procurements',
	};

	useEffect(() => {
		props.getProcurementReceived().then(response => {
			if (response.status === 'success') {
				setProcurementData(response);
			} else {
				history.push({
					pathname: '/procurements',
				});
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<HeaderPage pageName={layoutMetaInfo.pageName} pageTitle="Закупки" pageParams={pageParams} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index procurementData={procurementData} />
			</div>
		</Layout>
	);
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const {
		match: {
			params: { procurementId },
		},
	} = ownProps;

	return {
		getProcurementReceived: () => dispatch(getProcurementReceived({ params: { procurementId } })),
	};
};

export default compose(connect(null, mapDispatchToProps), withCurrentUser)(Procurement);
