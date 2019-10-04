import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../index.module.css';

const TitlePageOrLogo = props => {
	const { pageTitle, theme } = props;

	return (
		<div className={styles.columnGroup_left}>
			{theme !== 'bg' ? <div className={styles.titlePage}>{pageTitle}</div> : <Link className={styles.logo} to="/stocks" />}
		</div>
	);
};

export default TitlePageOrLogo;
