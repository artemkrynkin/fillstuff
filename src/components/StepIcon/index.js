import React from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.css';

function StepIcon({ completed, active, error, icon, activeStep }) {
	return (
		<>
			{completed ? (
				<div className={ClassNames(styles.completed, styles.default)}>
					<FontAwesomeIcon icon={['far', 'check']} />
				</div>
			) : active ? (
				<div className={ClassNames(styles.active, styles.default)} />
			) : error ? (
				<div className={ClassNames(styles.error, styles.default)} />
			) : (
				<div className={styles.default} />
			)}
		</>
	);
}

export default StepIcon;
