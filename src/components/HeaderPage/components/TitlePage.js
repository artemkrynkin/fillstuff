import React from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './TitlePage.module.css';

const TitlePage = props => {
	const { pageTitle, pageParams } = props;

	if (pageParams && pageParams.backToPage !== undefined) {
		const parseUrlReferrer = queryString.parseUrl(document.referrer);
		const queryReferrerString = queryString.stringify(parseUrlReferrer.query);

		return (
			<Link className={styles.backToPage} to={pageParams.backToPage + (queryReferrerString ? `?${queryReferrerString}` : '')}>
				<FontAwesomeIcon className={styles.backToPageIcon} icon={['far', 'angle-left']} />
				<div className={styles.titlePage}>{pageTitle}</div>
			</Link>
		);
	} else {
		return <div className={styles.titlePage}>{pageTitle}</div>;
	}
};

export default TitlePage;
