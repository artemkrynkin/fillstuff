import React from 'react';
import ClassNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import styles from './index.module.css';

const CardPaper = props => {
	const { className, elevation = 1, header = true, leftContent, rightContent, title, customRightColumn, style, children } = props;

	let cardPaperClassesObj = {
		[styles.container]: true,
	};

	if (className)
		cardPaperClassesObj = {
			...Object.fromEntries(
				className
					.split(' ')
					.filter(val => val)
					.map(key => [key, true])
			),
			...cardPaperClassesObj,
		};

	const cardPaperClasses = ClassNames(cardPaperClassesObj);

	return (
		<Paper className={cardPaperClasses} elevation={elevation} style={style}>
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

export default CardPaper;
