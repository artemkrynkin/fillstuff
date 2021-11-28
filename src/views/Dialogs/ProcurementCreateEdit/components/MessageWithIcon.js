import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import colorTheme from 'shared/colorTheme';

const styles = () => ({
	headerInfo: {
		marginBottom: 20,
		paddingBottom: 20,
	},
	headerInfoIcon: ({ error }) => ({
		color: !error ? colorTheme.blueGrey['300'] : colorTheme.red['500'],
		fontSize: 48,
		marginRight: 20,
	}),
	headerInfoText: ({ error }) => ({
		color: !error ? colorTheme.blueGrey['600'] : colorTheme.red['500'],
		lineHeight: 1.4,
	}),
});

function MessageWithIcon({ classes, icon, message }) {
	return (
		<div className={classes.headerInfo}>
			<Grid justifyContent="center" alignItems="center" container>
				{icon ? (
					<FontAwesomeIcon
						className={classes.headerInfoIcon}
						icon={icon}
						style={{ '--fa-primary-opacity': 0.9, '--fa-secondary-opacity': 0.2 }}
					/>
				) : null}
				<Typography className={classes.headerInfoText} variant="body1">
					{message}
				</Typography>
			</Grid>
		</div>
	);
}

export default withStyles(styles)(MessageWithIcon);
