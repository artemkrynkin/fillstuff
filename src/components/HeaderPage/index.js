import React from 'react';
import { compose } from 'redux';

import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';

import { withCurrentUser } from 'src/components/withCurrentUser';

import TitlePage from './components/TitlePage';
import PageButtons from './components/PageButtons';

import styles from './index.module.css';

const HeaderPage = props => {
	const { pageName, pageTitle, currentStudio, pageParams } = props;

	return (
		<AppBar className={styles.container} elevation={0}>
			<Container className={styles.containerWrapper}>
				<TitlePage pageName={pageName} pageTitle={pageTitle} pageParams={pageParams} />
				<PageButtons pageName={pageName} currentStudio={currentStudio} />
			</Container>
		</AppBar>
	);
};

export default compose(withCurrentUser)(HeaderPage);
