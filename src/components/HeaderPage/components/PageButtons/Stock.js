import React, { useState, lazy, Suspense, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuList from '@material-ui/core/MenuList';

import MenuItem from 'src/components/MenuItem';
import Dropdown from 'src/components/Dropdown';

import { Button } from './styles';
import styles from './index.module.css';

const DialogPositionCreate = lazy(() => import('src/views/Dialogs/PositionCreateEdit'));
const DialogPositionGroupCreate = lazy(() => import('src/views/Dialogs/PositionGroupCreateEditAdd'));

const Stock = () => {
	const refDropdownActions = useRef(null);
	const [dialogPositionCreate, setDialogPositionCreate] = useState(false);
	const [dialogPositionGroupCreate, setDialogPositionGroupCreate] = useState(false);
	const [dropdownActions, setDropdownActions] = useState(false);

	const onToggleDropdownActions = value => setDropdownActions(Boolean(value === null || value === undefined ? prevValue => !prevValue : value));

	const onOpenDialogPositionCreate = () => setDialogPositionCreate(true);

	const onCloseDialogPositionCreate = () => setDialogPositionCreate(false);

	const onOpenDialogPositionGroupCreate = () => setDialogPositionGroupCreate(true);

	const onCloseDialogPositionGroupCreate = () => setDialogPositionGroupCreate(false);

	return (
		<div className={styles.container}>
			<Button ref={refDropdownActions} onClick={onToggleDropdownActions} variant="contained" color="primary">
				Создать
			</Button>

			<Dropdown
				anchor={refDropdownActions}
				open={dropdownActions}
				onClose={() => onToggleDropdownActions(false)}
				placement="bottom-end"
				disablePortal={false}
				stopPropagation
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							onToggleDropdownActions();
							onOpenDialogPositionCreate();
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'box-alt']} fixedWidth />}
					>
						Позицию
					</MenuItem>
					<MenuItem
						onClick={() => {
							onToggleDropdownActions();
							onOpenDialogPositionGroupCreate();
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'folder-open']} fixedWidth />}
					>
						Группу
					</MenuItem>
				</MenuList>
			</Dropdown>

			<Suspense fallback={null}>
				<DialogPositionCreate type="create" dialogOpen={dialogPositionCreate} onCloseDialog={onCloseDialogPositionCreate} />

				<DialogPositionGroupCreate type="create" dialogOpen={dialogPositionGroupCreate} onCloseDialog={onCloseDialogPositionGroupCreate} />
			</Suspense>
		</div>
	);
};

export default Stock;
