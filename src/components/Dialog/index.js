import React, { Component } from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

import './index.styl';

export class PDDialog extends Component {
	onScroll = () => {
		const dialog = this.dialog;
		const dialogPaper = dialog.firstElementChild;
		const dialogActions = dialog.querySelector('.pd-dialog__actions');
		const dialogActionsWrap = dialog.querySelector('.pd-dialog__actions-wrap');

		dialogActions.style.height = `${dialogActionsWrap.clientHeight}px`;
		dialogActionsWrap.style.maxWidth = `${dialogActions.clientWidth}px`;

		if (
			window.innerHeight <= dialogPaper.offsetTop + dialogPaper.clientHeight &&
			dialog.scrollTop + window.innerHeight <= dialogPaper.offsetTop + dialogPaper.clientHeight
		) {
			if (!dialog.classList.contains('pd-dialog_sticky-actions-stuck')) {
				dialog.classList.add('pd-dialog_sticky-actions-stuck');
			}
		} else {
			if (dialog.classList.contains('pd-dialog_sticky-actions-stuck')) {
				dialog.classList.remove('pd-dialog_sticky-actions-stuck');
			}
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

		let dialogProps = Object.assign({}, this.props);

		delete dialogProps.stickyActions;

		let dialogClasses = ClassNames({
			'pd-dialog': true,
			'pd-dialog_sticky-actions': stickyActions,
		});

		return (
			<Dialog
				className={dialogClasses}
				onEnter={this.onEnter}
				onExiting={this.onExiting}
				onScroll={event => (stickyActions ? this.onScroll(event) : null)}
				{...dialogProps}
			/>
		);
	}
}

export const PDDialogTitle = props => {
	const { theme, titlePosition, onClose, children } = props;

	let dialogTitleClasses = ClassNames({
		'pd-dialog__title': true,
		'pd-dialog__title_primary': children && theme === 'primary',
		'pd-dialog__title_grey': children && theme === 'grey',
		'pd-dialog__title_no-theme': !children,
		'pd-dialog__title_position-center': titlePosition === 'center',
	});

	return (
		<DialogTitle className={dialogTitleClasses} disableTypography>
			{children}
			{onClose ? (
				<IconButton className="pd-dialog__close" onClick={onClose} disableRipple>
					<FontAwesomeIcon icon={['fal', 'times']} />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

export const PDDialogActions = props => {
	const { disableActionSpacing = true, leftHandleProps, rightHandleProps } = props;

	let dialogActionsClasses = ClassNames({
		'pd-dialog__actions': true,
	});

	return (
		<DialogActions className={dialogActionsClasses} disableActionSpacing={disableActionSpacing}>
			<div className="pd-dialog__actions-wrap">
				{leftHandleProps && leftHandleProps.handleProps && leftHandleProps.text ? (
					<Button className="pd-dialog__actions-left-handle" {...leftHandleProps.handleProps}>
						{leftHandleProps.text}
					</Button>
				) : null}
				{rightHandleProps && rightHandleProps.handleProps && rightHandleProps.text ? (
					<Button
						className="pd-dialog__actions-right-handle"
						variant="contained"
						color="primary"
						{...rightHandleProps.handleProps}
					>
						{rightHandleProps.text}
					</Button>
				) : null}
			</div>
		</DialogActions>
	);
};
