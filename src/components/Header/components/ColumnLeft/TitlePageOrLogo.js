import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { history } from 'src/helpers/history';

import styles from 'src/components/Header/index.module.css';

const backToPage = pageParams => {
	if (!!~document.referrer.search(pageParams.backToPage)) history.go(-1);
	else history.push(pageParams.backToPage);
};

const TitlePageOrLogo = props => {
	const {
		pageTitle,
		// theme,
		pageParams,
	} = props;

	if (pageParams && pageParams.backToPage !== undefined) {
		return (
			<div className={styles.columnGroup_left}>
				<div className={styles.backToPage} onClick={() => backToPage(pageParams)}>
					<FontAwesomeIcon className={styles.backToPageIcon} icon={['far', 'angle-left']} />
					<div className={styles.titlePage}>{pageTitle}</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className={styles.columnGroup_left}>
				<div className={styles.titlePage}>{pageTitle}</div>
				{/*{theme !== 'bg' ? <div className={styles.titlePage}>{pageTitle}</div> : <Link className={styles.logo} to="/stocks" />}*/}
			</div>
		);
	}
};

export default TitlePageOrLogo;
