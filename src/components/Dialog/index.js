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

import './index.styl';

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
			const stickyTarget = records[0].target.parentElement.querySelector(stickySelector);
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

	observer.observe(container.querySelector(`.pd-dialog__sentinel-${position}`));
};

export class PDDialog extends Component {
	static propTypes = {
		stickyTitle: PropTypes.bool,
		stickyActions: PropTypes.bool,
	};

	onEnter = element => {
		if (this.props.stickyTitle) observeActions(element, 'top', '.pd-dialog__title');
		if (this.props.stickyActions) observeActions(element, 'bottom', '.pd-dialog__actions');
	};

	render() {
		const { stickyTitle, stickyActions, children, ...props } = this.props;

		const dialogClasses = ClassNames({
			'pd-dialog_sticky-title': stickyTitle,
			'pd-dialog_sticky-actions': stickyActions,
		});

		return (
			<MuiDialog onEnter={this.onEnter} className={dialogClasses} transitionDuration={150} {...props}>
				{stickyTitle ? <div className="pd-dialog__sentinel-top" /> : null}
				{children}
				{stickyActions ? <div className="pd-dialog__sentinel-bottom" /> : null}
			</MuiDialog>
		);
	}
}

export const PDDialogTitle = props => {
	const { theme, titlePositionCenter, leftHandleProps, onClose, children } = props;

	const dialogTitleClasses = ClassNames({
		'pd-dialog__title': true,
		'pd-dialog__title_primary': children && theme === 'primary',
		'pd-dialog__title_grey': children && theme === 'grey',
		'pd-dialog__title_no-theme': !children,
	});

	const dialogTitleTextClasses = ClassNames({
		'pd-dialog__title-text': true,
		[`pd-dialog__title-text_center`]: titlePositionCenter,
	});

	const dialogTitleActionLeftHandleClasses = ClassNames({
		'pd-dialog__title-action-left-handle': true,
		[`pd-dialog__title-action-left-handle_icon-left`]: leftHandleProps && leftHandleProps.iconPositionLeft,
	});

	return (
		<DialogTitle className={dialogTitleClasses} disableTypography>
			{leftHandleProps && leftHandleProps.handleProps && leftHandleProps.text ? (
				<ButtonBase className={dialogTitleActionLeftHandleClasses} disableRipple {...leftHandleProps.handleProps}>
					<div className="pd-dialog__title-action-left-handle-text">{leftHandleProps.text}</div>
					{leftHandleProps.icon}
				</ButtonBase>
			) : null}
			<div className={dialogTitleTextClasses} children={children} />
			{onClose ? (
				<IconButton className="pd-dialog__close" onClick={onClose} disableRipple>
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
		'pd-dialog__actions': true,
	});

	return (
		<DialogActions className={dialogActionsClasses} disableSpacing={disableSpacing}>
			<div className="pd-dialog__actions-wrap">
				{leftHandleProps && leftHandleProps.handleProps && leftHandleProps.text ? (
					<Button className="pd-dialog__actions-left-handle" {...leftHandleProps.handleProps}>
						<div className="pd-dialog__actions-handle-text-wrap">
							{leftHandleProps.iconLeft ? leftHandleProps.iconLeft : null}
							<div className="pd-dialog__actions-handle-text">{leftHandleProps.text}</div>
							{leftHandleProps.iconRight ? leftHandleProps.iconRight : null}
						</div>
					</Button>
				) : null}
				{rightHandleProps && rightHandleProps.handleProps && rightHandleProps.text ? (
					<Button className="pd-dialog__actions-right-handle" variant="contained" color="primary" {...rightHandleProps.handleProps}>
						<div className="pd-dialog__actions-handle-text-wrap">
							{rightHandleProps.iconLeft ? rightHandleProps.iconLeft : null}
							<div className="pd-dialog__actions-handle-text">{rightHandleProps.text}</div>
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
