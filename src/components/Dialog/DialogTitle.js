import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

import styles from './index.module.css';
import DialogSticky from './DialogSticky';

export const DialogTitle = props => {
	const { theme, titlePositionCenter, leftHandleProps, onClose, children } = props;

	const classes = ClassNames({
		[styles.title]: true,
		[styles.title_primary]: children && theme === 'primary',
		[styles.title_grey]: children && theme === 'grey',
		[styles.title_noTheme]: !children,
	});

	const textClasses = ClassNames({
		[styles.titleText]: true,
		[styles.titleText_center]: titlePositionCenter,
	});

	const actionLeftHandleClasses = ClassNames({
		[styles.headerActionLeftHandle]: true,
	});

	return (
		<MuiDialogTitle className={classes} disableTypography>
			{leftHandleProps && leftHandleProps.handleProps && leftHandleProps.text ? (
				<ButtonBase className={actionLeftHandleClasses} disableRipple {...leftHandleProps.handleProps}>
					<div className={styles.headerActionLeftHandleText}>{leftHandleProps.text}</div>
				</ButtonBase>
			) : null}
			<div className={textClasses} children={children} />
			{onClose ? (
				<IconButton className={styles.close} onClick={onClose} disableRipple>
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
	theme: PropTypes.oneOf(['primary', 'grey']),
	titlePositionCenter: PropTypes.bool,
	leftHandleProps: PropTypes.shape({
		handleProps: PropTypes.object,
		text: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
	}),
	onClose: PropTypes.func,
	children: PropTypes.node,
};

export default DialogTitle;
