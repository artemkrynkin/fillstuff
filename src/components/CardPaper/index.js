import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import './index.styl';

const CardPaper = props => {
	const { elevation, leftContent, rightContent, title, customRightColumn, style, children } = props;

	return (
		<Paper className="card-paper" elevation={elevation} style={style}>
			<Grid className="card-paper__header" container>
				{leftContent && title ? <div className="card-paper__title">{leftContent}</div> : leftContent}
				{rightContent && !customRightColumn ? (
					<Grid item style={{ marginLeft: 'auto' }}>
						{rightContent}
					</Grid>
				) : (
					rightContent
				)}
			</Grid>
			<div className="card-paper__content">{children}</div>
		</Paper>
	);
};

export default CardPaper;
