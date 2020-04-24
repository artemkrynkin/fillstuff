import React from 'react';
import ClassNames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './index.module.css';

export const LoadingPage = () => (
	<div className={styles.page}>
		<CircularProgress size={50} color="primary" thickness={3} />
	</div>
);

export const LoadingComponent = props => {
	const { className, style, ...remainingProps } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.component]: true,
	});

	return (
		<div className={classes} style={style}>
			<CircularProgress size={25} color="primary" thickness={3} {...remainingProps} />
		</div>
	);
};

LoadingComponent.defaultProps = {
	className: '',
};
