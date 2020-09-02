import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
	card: {
		cursor: 'pointer',
		minHeight: 165,
		position: 'relative',
		transition: 'box-shadow 150ms ease-out',
		'&:hover': {
			boxShadow: theme.shadows[3],
		},
	},
}));
