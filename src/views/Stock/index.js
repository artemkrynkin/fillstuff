import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Layout from 'src/components/Layout';
import HeaderPage from 'src/components/HeaderPage';
import { withCurrentUser } from 'src/components/withCurrentUser';

import { getPositions } from 'src/actions/positions';
import { getPositionGroups } from 'src/actions/positionGroups';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

import Index from './containers/index';

const Stock = props => {
	const { currentStudio, positions, positionGroups } = props;

	const layoutMetaInfo = {
		pageName: 'stock',
		pageTitle: 'Склад',
	};

	useEffect(() => {
		props.getPositions({ emptyData: true });
		props.getPositionGroups({ emptyData: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<HeaderPage pageName={layoutMetaInfo.pageName} pageTitle={layoutMetaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index currentStudio={currentStudio} positions={positions} positionGroups={positionGroups} />
			</div>
		</Layout>
	);
};

const mapStateToProps = state => {
	return {
		positions: state.positions,
		positionGroups: state.positionGroups,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getPositions: options => dispatch(getPositions({ ...options })),
		getPositionGroups: options => dispatch(getPositionGroups({ ...options })),
	};
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withCurrentUser)(Stock);
