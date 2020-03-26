import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import MuiDialog from '@material-ui/core/Dialog';

import { observeActions } from './utils';

import './index.module.css';
import stylesDialogTitle from './DialogTitle.module.css';

export const DialogSticky = props => {
	const { stickyAnyone, stickyTitle, stickyActions, children, ...remainingProps } = props;
	const dialogRef = useRef(null);

	const onEnterDialog = element => {
		const { onEnter } = remainingProps;

		if (stickyTitle) observeActions(element, stylesDialogTitle.title, 'top');
		if (stickyActions) observeActions(element, 'MuiDialogActions-root', 'bottom');

		stickyAnyone.forEach(({ stickySelector, position, sentinelAdditionalText }) => {
			observeActions(element, stickySelector, position, sentinelAdditionalText);
		});

		if (typeof onEnter === 'function') onEnter(element);
	};

	const classes = ClassNames({
		sticky: !stickyAnyone.length,
		stickyTitle: stickyTitle,
		stickyActions: stickyActions,
	});

	return (
		<MuiDialog ref={dialogRef} className={classes} transitionDuration={200} {...remainingProps} onEnter={onEnterDialog}>
			{stickyTitle ? <div className="sentinel-top" /> : null}
			{children}
			{stickyActions ? <div className="sentinel-bottom" /> : null}
		</MuiDialog>
	);
};

DialogSticky.defaultProps = {
	stickyTitle: false,
	stickyActions: false,
	stickyAnyone: [],
};

DialogSticky.propTypes = {
	stickyTitle: PropTypes.bool.isRequired,
	stickyActions: PropTypes.bool.isRequired,
	stickyAnyone: PropTypes.arrayOf(
		PropTypes.shape({
			stickySelector: PropTypes.node.isRequired,
			position: PropTypes.oneOf(['top', 'bottom']).isRequired,
			sentinelAdditionalText: PropTypes.string,
		})
	).isRequired,
	children: PropTypes.node,
};

export default DialogSticky;
