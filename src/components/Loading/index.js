import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './index.module.css';

export const LoadingPage = props => {
	const { className, style, ...remainingProps } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.page]: true,
	});

	return (
		<div className={classes} style={style}>
			<CircularProgress size={50} color="primary" thickness={2} {...remainingProps} />
		</div>
	);
};

LoadingPage.defaultProps = {
	className: '',
};

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

export const FilteredComponent = props => {
	const { loading, className, style, children, ...remainingProps } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.filteredComponent]: true,
		[styles.filteredComponentUpdate]: loading,
	});

	return (
		<div className={classes} style={style}>
			<div className={styles.filteredComponentWrapper}>{children}</div>
			{loading ? (
				<CircularProgress className={styles.filteredComponentLoader} size={50} color="primary" thickness={2} {...remainingProps} />
			) : null}
		</div>
	);
};

FilteredComponent.defaultProps = {
	className: '',
};

FilteredComponent.propTypes = {
	loading: PropTypes.bool.isRequired,
};
