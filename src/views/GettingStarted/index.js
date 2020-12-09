import React from 'react';

import Layout from 'src/components/Layout';

import styles from './index.module.css';

import Index from './containers/index';

const GettingStarted = props => {
	const { currentStudio } = props;

	const layoutMetaInfo = {
		pageName: 'getting-started',
		pageTitle: 'Добро пожаловать!',
	};

	return (
		<Layout metaInfo={layoutMetaInfo}>
			<div className={styles.container}>
				<Index currentStudio={currentStudio} />
			</div>
		</Layout>
	);
};

export default GettingStarted;
