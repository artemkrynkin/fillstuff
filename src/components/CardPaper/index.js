import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import styles from './index.module.css';

const CardPaper = props => {
	const { className, elevation, header, leftContent, rightContent, title, customRightColumn, style, children } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
	});

	return (
		<Paper className={classes} elevation={elevation} style={style}>
			{header ? (
				<Grid className={styles.header} container>
					{leftContent && title ? <div className={styles.title}>{leftContent}</div> : leftContent}
					{rightContent && !customRightColumn ? (
						<Grid item style={{ marginLeft: 'auto' }}>
							{rightContent}
						</Grid>
					) : (
						rightContent
					)}
				</Grid>
			) : null}
			<div className={styles.content}>{children}</div>
		</Paper>
	);
};

CardPaper.defaultProps = {
	className: '',
	elevation: 1,
	header: true,
	customRightColumn: false,
};

CardPaper.propTypes = {
	className: PropTypes.string,
	elevation: PropTypes.number.isRequired,
	header: PropTypes.bool.isRequired,
	leftContent: PropTypes.node,
	rightContent: PropTypes.node,
	title: PropTypes.bool,
	customRightColumn: PropTypes.bool,
	style: PropTypes.object,
	children: PropTypes.node.isRequired,
};

export default CardPaper;
