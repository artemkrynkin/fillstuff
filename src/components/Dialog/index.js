import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import MuiDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

import styles from './index.module.css';

export const Dialog = props => {
	return <MuiDialog transitionDuration={150} children={props.children} {...props} />;
};

Dialog.propTypes = {
	children: PropTypes.node,
};

const observeActions = (container, position = null, stickySelector) => {
	const observer = new IntersectionObserver(
		(records, observer) => {
			const targetInfo = records[0].boundingClientRect;
			const stickyTarget = records[0].target.parentElement.querySelector(`.${stickySelector}`);
			const rootBoundsInfo = records[0].rootBounds;

			if (position === 'top') {
				// console.log(targetInfo.bottom, rootBoundsInfo.top);

				if (targetInfo.bottom < rootBoundsInfo.top) {
					stickyTarget.classList.toggle('stuck', true);
				}

				if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
					stickyTarget.classList.toggle('stuck', false);
				}
			}

			if (position === 'bottom') {
				if (targetInfo.bottom > rootBoundsInfo.top) {
					stickyTarget.classList.toggle('stuck', true);
				}

				if (targetInfo.bottom <= rootBoundsInfo.bottom && targetInfo.bottom > rootBoundsInfo.top) {
					stickyTarget.classList.toggle('stuck', false);
				}
			}
		},
		{
			threshold: [0],
			root: container,
		}
	);

	observer.observe(container.querySelector(`.sentinel-${position}`));
};

export class PDDialog extends Component {
	static propTypes = {
		stickyTitle: PropTypes.bool,
		stickyActions: PropTypes.bool,
	};

	onEnterDialog = element => {
		const { onEnter, stickyTitle, stickyActions } = this.props;

		if (stickyTitle) observeActions(element, 'top', styles.stickyTitle);
		if (stickyActions) observeActions(element, 'bottom', styles.actions);

		if (typeof onEnter === 'function') onEnter();
	};

	render() {
		const { stickyTitle, stickyActions, children, ...props } = this.props;

		const dialogClasses = ClassNames({
			[styles.stickyTitle]: stickyTitle,
			[styles.stickyActions]: stickyActions,
		});

		return (
			<MuiDialog className={dialogClasses} transitionDuration={150} {...props} onEnter={this.onEnterDialog}>
				{stickyTitle ? <div className="sentinel-top" /> : null}
				{children}
				{stickyActions ? <div className="sentinel-bottom" /> : null}
			</MuiDialog>
		);
	}
}

export const PDDialogTitle = props => {
	const { theme, titlePositionCenter, leftHandleProps, onClose, children } = props;

	const dialogTitleClasses = ClassNames({
		[styles.title]: true,
		[styles.title_primary]: children && theme === 'primary',
		[styles.title_grey]: children && theme === 'grey',
		[styles.title_noTheme]: !children,
	});

	const dialogTitleTextClasses = ClassNames({
		[styles.titleText]: true,
		[styles.titleText_center]: titlePositionCenter,
	});

	const dialogTitleActionLeftHandleClasses = ClassNames({
		[styles.headerActionLeftHandle]: true,
		[styles.headerActionLeftHandle_iconLeft]: leftHandleProps && leftHandleProps.iconPositionLeft,
	});

	return (
		<DialogTitle className={dialogTitleClasses} disableTypography>
			{leftHandleProps && leftHandleProps.handleProps && leftHandleProps.text ? (
				<ButtonBase className={dialogTitleActionLeftHandleClasses} disableRipple {...leftHandleProps.handleProps}>
					<div className={styles.headerActionLeftHandleText}>{leftHandleProps.text}</div>
					{leftHandleProps.icon}
				</ButtonBase>
			) : null}
			<div className={dialogTitleTextClasses} children={children} />
			{onClose ? (
				<IconButton className={styles.close} onClick={onClose} disableRipple>
					<FontAwesomeIcon icon={['fal', 'times']} />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

PDDialogTitle.propTypes = {
	children: PropTypes.node,
	theme: PropTypes.oneOf(['primary', 'grey']),
	titlePositionCenter: PropTypes.bool,
	leftHandleProps: PropTypes.shape({
		handleProps: PropTypes.object,
		text: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
		icon: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
		iconPositionLeft: PropTypes.bool,
	}),
	onClose: PropTypes.func,
};

export const PDDialogActions = props => {
	const { disableSpacing, leftHandleProps, rightHandleProps } = props;

	let dialogActionsClasses = ClassNames({
		[styles.actions]: true,
	});

	return (
		<DialogActions className={dialogActionsClasses} disableSpacing={disableSpacing}>
			<div className={styles.actionsWrap}>
				{leftHandleProps && leftHandleProps.handleProps && leftHandleProps.text ? (
					<Button className={styles.actionsLeftHandle} {...leftHandleProps.handleProps}>
						<div className={styles.actionsHandleTextWrap}>
							{leftHandleProps.iconLeft ? leftHandleProps.iconLeft : null}
							<div className={styles.actionsHandleText}>{leftHandleProps.text}</div>
							{leftHandleProps.iconRight ? leftHandleProps.iconRight : null}
						</div>
					</Button>
				) : null}
				{rightHandleProps && rightHandleProps.handleProps && rightHandleProps.text ? (
					<Button className={styles.actionsRightHandle} variant="contained" color="primary" {...rightHandleProps.handleProps}>
						<div className={styles.actionsHandleTextWrap}>
							{rightHandleProps.iconLeft ? rightHandleProps.iconLeft : null}
							<div className={styles.actionsHandleText}>{rightHandleProps.text}</div>
							{rightHandleProps.iconRight ? rightHandleProps.iconRight : null}
						</div>
					</Button>
				) : null}
			</div>
		</DialogActions>
	);
};

PDDialogActions.defaultProps = {
	disableSpacing: true,
};

PDDialogActions.propTypes = {
	disableSpacing: PropTypes.bool,
	leftHandleProps: PropTypes.shape({
		handleProps: PropTypes.object,
		text: PropTypes.node.isRequired,
		iconLeft: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
		iconRight: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
	}),
	rightHandleProps: PropTypes.shape({
		handleProps: PropTypes.object,
		text: PropTypes.node.isRequired,
		iconLeft: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
		iconRight: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
	}),
};
