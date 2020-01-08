import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiDialogActions from '@material-ui/core/DialogActions';

import styles from './index.module.css';

export const DialogActions = props => {
	const { disableSpacing, leftHandleProps, rightHandleProps } = props;

	const classes = ClassNames({
		[styles.actions]: true,
	});

	return (
		<MuiDialogActions className={classes} disableSpacing={disableSpacing}>
			<div className={styles.actionsWrap}>
				{leftHandleProps && leftHandleProps.handleProps && leftHandleProps.text ? (
					<Button className={styles.actionsLeftHandle} {...leftHandleProps.handleProps}>
						{leftHandleProps.isLoading ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
						<div className={styles.actionsHandleText} style={{ opacity: Number(!leftHandleProps.isLoading) }}>
							{leftHandleProps.text}
						</div>
					</Button>
				) : null}
				{rightHandleProps && rightHandleProps.handleProps && rightHandleProps.text ? (
					<Button className={styles.actionsRightHandle} variant="contained" color="primary" {...rightHandleProps.handleProps}>
						{rightHandleProps.isLoading ? <CircularProgress size={20} style={{ position: 'absolute' }} /> : null}
						<div className={styles.actionsHandleText} style={{ opacity: Number(!rightHandleProps.isLoading) }}>
							{rightHandleProps.text}
						</div>
					</Button>
				) : null}
			</div>
		</MuiDialogActions>
	);
};

DialogActions.defaultProps = {
	disableSpacing: true,
};

DialogActions.propTypes = {
	disableSpacing: PropTypes.bool.isRequired,
	leftHandleProps: PropTypes.shape({
		handleProps: PropTypes.object,
		text: PropTypes.node,
		isLoading: PropTypes.bool,
	}),
	rightHandleProps: PropTypes.shape({
		handleProps: PropTypes.object,
		text: PropTypes.node.isRequired,
		isLoading: PropTypes.bool,
	}),
};

export default DialogActions;
