import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';

import { history } from 'src/helpers/history';

import styles from 'src/components/Header/index.module.css';

const TitlePageOrLogo = props => {
	const {
		pageTitle,
		// theme,
		pageParams,
	} = props;

	if (pageParams && pageParams.backToPage !== undefined) {
		return (
			<div className={styles.columnGroup_left}>
				<ButtonBase className={styles.backToPage} onClick={() => history.go(pageParams.backToPage)}>
					<FontAwesomeIcon className={styles.backToPageIcon} icon={['far', 'angle-left']} />
					<div className={styles.titlePage}>{pageTitle}</div>
				</ButtonBase>
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
