import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

import './index.styl';

export class PDDialog extends Component {
	static propTypes = {
		stickyActions: PropTypes.bool,
	};

	state = {
		stuck: false,
	};

	onScroll = () => {
		const dialog = this.dialog;
		const dialogPaper = dialog.firstElementChild;

		if (
			window.innerHeight <= dialogPaper.offsetTop + dialogPaper.clientHeight &&
			dialog.scrollTop + window.innerHeight <= dialogPaper.offsetTop + dialogPaper.clientHeight
		) {
			this.setState({ stuck: true });
		} else {
			this.setState({ stuck: false });
		}
	};

	onEnter = element => {
		this.dialog = element;

		function onElementHeightChanged(elm, callback) {
			let lastHeight = elm.clientHeight,
				newHeight;

			(function run() {
				newHeight = elm.clientHeight;
				if (lastHeight !== newHeight) callback();
				lastHeight = newHeight;

				if (elm.onElementHeightChangeTimer) clearTimeout(elm.onElementHeightChangeTimer);

				elm.onElementHeightChangeTimer = setTimeout(run, 0);
			})();
		}

		if (this.props.stickyActions) {
			this.onScroll();

			onElementHeightChanged(element.firstElementChild, this.onScroll);

			window.addEventListener('resize', this.onScroll);
		}
	};

	onExiting = () => {
		if (this.props.stickyActions) window.removeEventListener('resize', this.onScroll);
	};

	render() {
		const { stickyActions } = this.props;
		const { stuck } = this.state;

		let dialogProps = Object.assign({}, this.props);

		delete dialogProps.stickyActions;

		const dialogClasses = ClassNames({
			'pd-dialog_sticky-actions': stickyActions,
			'pd-dialog_sticky-actions-stuck': stuck,
		});

		return (
			<Dialog
				onEnter={this.onEnter}
				onExiting={this.onExiting}
				className={dialogClasses}
				onScroll={event => (stickyActions ? this.onScroll(event) : null)}
				{...dialogProps}
			/>
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
					<Button
						className="pd-dialog__actions-right-handle"
						variant="contained"
						color="primary"
						{...rightHandleProps.handleProps}
					>
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
