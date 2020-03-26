import React, { forwardRef } from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MuiMenuItem from '@material-ui/core/MenuItem';

import styles from './MenuItem.module.css';
import PropTypes from 'prop-types';

const MenuItem = forwardRef((props, ref) => {
	const { className, children, destructive, iconBefore, iconAfter, ...remainingProps } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
		[styles.destructive]: destructive,
	});

	return (
		<MuiMenuItem className={classes} innerRef={ref} {...remainingProps}>
			{iconBefore !== undefined ? <div className={styles.iconBefore}>{iconBefore}</div> : null}
			<div className={styles.content}>{children}</div>
			{props.selected !== undefined ? (
				<div className={styles.iconAfter}>
					<FontAwesomeIcon icon={['far', 'check']} />
				</div>
			) : iconAfter !== undefined ? (
				<div className={styles.iconAfter}>{iconAfter}</div>
			) : null}
		</MuiMenuItem>
	);
});

MenuItem.defaultProps = {
	className: '',
	destructive: false,
};

MenuItem.propTypes = {
	destructive: PropTypes.bool,
	selected: PropTypes.bool,
	iconBefore: PropTypes.node,
	iconAfter: PropTypes.node,
};

export default MenuItem;
