import React from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormLabel from '@material-ui/core/FormLabel';
import ButtonBase from '@material-ui/core/ButtonBase';

import styles from './index.module.css';

const CheckboxIcon = props => {
	const { icon, label, checked, disabled, ...remainingProps } = props;

	return (
		<ButtonBase
			{...remainingProps}
			className={ClassNames({
				[styles.container]: true,
				[styles.active]: checked,
				[styles.disabled]: disabled,
			})}
		>
			<div className={styles.box}>
				<FontAwesomeIcon className={styles.checkIcon} icon={['fas', 'check-circle']} />
				{icon ? <div className={styles.icon}>{icon}</div> : null}
			</div>
			<FormLabel className={styles.label} component="span">
				{label}
			</FormLabel>
		</ButtonBase>
	);
};

export default CheckboxIcon;
