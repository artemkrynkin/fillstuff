import React from 'react';

import Layout from 'src/components/Layout';
import HeaderPage from 'src/components/HeaderPage';

import stylesPage from 'src/styles/page.module.css';
import styles from './index.module.css';

import Index from './containers/index';

const Stocktaking = props => {
	const { currentStudio } = props;

	const layoutMetaInfo = {
		pageName: 'stocktaking',
		pageTitle: 'Инвентаризации',
	};

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<HeaderPage pageName={layoutMetaInfo.pageName} pageTitle={layoutMetaInfo.pageTitle} />
			<div className={`${stylesPage.pageContent} ${styles.container}`}>
				<Index currentStudio={currentStudio} />
			</div>
		</Layout>
	);
};

export default Stocktaking;
