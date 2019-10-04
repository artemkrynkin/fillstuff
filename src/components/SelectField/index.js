import React from 'react';

import { Field, FastField } from 'formik';
import { Select } from 'formik-material-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fade from '@material-ui/core/Fade';

import styles from './index.module.css';

export const SelectField = props => (
	<Field
		component={Select}
		IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className={styles.icon} />}
		MenuProps={{
			elevation: 3,
			transitionDuration: 150,
			TransitionComponent: Fade,
		}}
		{...props}
	/>
);

export const SelectFastField = props => (
	<FastField
		component={Select}
		IconComponent={() => <FontAwesomeIcon icon={['far', 'angle-down']} className={styles.icon} />}
		MenuProps={{
			elevation: 3,
			transitionDuration: 150,
			TransitionComponent: Fade,
		}}
		{...props}
	/>
);
