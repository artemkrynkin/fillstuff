import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

import styles from './DialogTitle.module.css';

export const DialogTitle = props => {
	const { theme, titlePositionCenter, onClose, children } = props;

	const classes = ClassNames({
		[styles.title]: true,
		[styles.titlePrimary]: children && theme === 'primary',
		[styles.titleWhite]: children && theme === 'white',
		[styles.titleNoTheme]: theme === 'noTheme' || !children,
		[styles.titleNoContent]: !children,
	});

	const textClasses = ClassNames({
		[styles.titleText]: true,
		[styles.titleTextCenter]: titlePositionCenter,
	});

	return (
		<MuiDialogTitle className={classes} disableTypography>
			<div className={textClasses} children={children} />
			{onClose ? (
				<IconButton className={styles.close} onClick={onClose}>
					<FontAwesomeIcon icon={['fal', 'times']} />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
};

DialogTitle.defaultProps = {
	theme: 'primary',
};

DialogTitle.propTypes = {
	theme: PropTypes.oneOf(['primary', 'white', 'noTheme']),
	titlePositionCenter: PropTypes.bool,
	onClose: PropTypes.func,
	children: PropTypes.node,
};

export default DialogTitle;
