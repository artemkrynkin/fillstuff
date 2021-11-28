import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';

import { DialogSticky, DialogTitle } from 'src/components/Dialog';
import MenuItem from 'src/components/MenuItem';
import Dropdown from 'src/components/Dropdown';

import { getProcurementExpected } from 'src/actions/procurements';

import Content from './Content';

import styles from './index.module.css';

const ProcurementExpectedView = props => {
	const { dialogOpen, onCloseDialog, selectedProcurementId, onOpenDialogByName } = props;
	const refDropdownActions = useRef(null);
	const [dropdownActions, setDropdownActions] = useState(false);
	const [selectedProcurement, setSelectedProcurement] = useState(null);

	if (!selectedProcurementId) return null;

	const onEnterDialog = () => {
		const { onCloseDialog } = props;

		if (selectedProcurementId) {
			props.getProcurementExpected({ procurementId: selectedProcurementId }).then(response => {
				if (response.status === 'success') {
					setSelectedProcurement(response.data);
				} else {
					onCloseDialog();
				}
			});
		} else {
			setSelectedProcurement(null);
		}
	};

	const onExitedDialog = () => {
		const { onExitedDialog } = props;

		if (selectedProcurement) setSelectedProcurement(null);
		if (onExitedDialog) onExitedDialog();
	};

	const onHandleDropdownActions = value => setDropdownActions(value === null || value === undefined ? prevValue => !prevValue : value);

	return (
		<DialogSticky
			open={dialogOpen}
      TransitionProps={{
        onEnter: onEnterDialog,
        onExited: onExitedDialog
      }}
			onClose={onCloseDialog}
			maxWidth="md"
			scroll="body"
			stickyTitle
		>
			<DialogTitle onClose={onCloseDialog} theme="white">
				{selectedProcurement ? (
					<Grid className={styles.headerActions} alignItems="center" container>
						{selectedProcurement.isConfirmed ? (
							<Button
								onClick={() => onOpenDialogByName('dialogProcurementCreate', 'procurement', selectedProcurement)}
								color="primary"
								variant="contained"
								size="small"
							>
								Оформить закупку
							</Button>
						) : (
							<Button
								onClick={() => onOpenDialogByName('dialogProcurementConfirm', 'procurement', selectedProcurement)}
								color="primary"
								variant="contained"
								size="small"
							>
								Подтвердить доставку
							</Button>
						)}
						<IconButton
							ref={refDropdownActions}
							className={ClassNames({
								[styles.otherActionsButton]: true,
								activeAction: dropdownActions,
							})}
							onClick={() => onHandleDropdownActions()}
						>
							<FontAwesomeIcon icon={['far', 'ellipsis-h']} />
						</IconButton>
					</Grid>
				) : null}
			</DialogTitle>
			{selectedProcurement ? (
				<>
					<Content procurement={selectedProcurement} />
					<Dropdown
						anchor={refDropdownActions}
						open={dropdownActions}
						onClose={() => onHandleDropdownActions(false)}
						placement="bottom-end"
						disablePortal={false}
					>
						<MenuList>
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									onOpenDialogByName('dialogProcurementEdit', 'procurement', selectedProcurement);
								}}
								iconBefore={<FontAwesomeIcon icon={['far', 'pen']} fixedWidth />}
							>
								Редактировать
							</MenuItem>
							<MenuItem
								onClick={() => {
									onHandleDropdownActions();
									onOpenDialogByName('dialogProcurementExpectedCancel', 'procurement', selectedProcurement);
								}}
								iconBefore={<FontAwesomeIcon icon={['far', 'undo']} fixedWidth />}
								destructive
							>
								Отменить доставку
							</MenuItem>
						</MenuList>
					</Dropdown>
				</>
			) : null}
		</DialogSticky>
	);
};

ProcurementExpectedView.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	selectedProcurement: PropTypes.object,
	onOpenDialogByName: PropTypes.func,
};

const mapDispatchToProps = dispatch => {
	return {
		getProcurementExpected: params => dispatch(getProcurementExpected({ params })),
	};
};

export default connect(null, mapDispatchToProps)(ProcurementExpectedView);
