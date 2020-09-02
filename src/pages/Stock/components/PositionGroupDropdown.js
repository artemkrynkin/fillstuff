import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';

import MenuItem from 'src/components/MenuItem';
import Dropdown from 'src/components/Dropdown';

const PositionGroupDropdown = props => {
	const { refDropdownActions, dropdownActions, onToggleDropdownActions, onOpenDialogPositionGroup, positionGroup } = props;

	return (
		<Dropdown
			anchor={refDropdownActions}
			open={dropdownActions}
			onClose={() => onToggleDropdownActions(false)}
			placement="bottom-end"
			disablePortal={false}
		>
			<MenuList>
				<MenuItem
					onClick={event => {
						event.stopPropagation();
						onToggleDropdownActions();
						onOpenDialogPositionGroup('dialogPositionGroupQRCode', 'positionGroup', positionGroup);
					}}
					iconBefore={<FontAwesomeIcon icon={['far-c', 'qr-code']} fixedWidth />}
				>
					Печать QR-кода
				</MenuItem>
			</MenuList>
			<Divider />
			<MenuList>
				<MenuItem
					onClick={event => {
						event.stopPropagation();
						onToggleDropdownActions();
						onOpenDialogPositionGroup('dialogPositionGroupAdd', 'positionGroup', positionGroup);
					}}
					iconBefore={<FontAwesomeIcon icon={['far', 'folder-plus']} fixedWidth />}
				>
					Добавить позиции
				</MenuItem>
				<MenuItem
					onClick={event => {
						event.stopPropagation();
						onToggleDropdownActions();
						onOpenDialogPositionGroup('dialogPositionGroupEdit', 'positionGroup', positionGroup);
					}}
					iconBefore={<FontAwesomeIcon icon={['far', 'pen']} fixedWidth />}
				>
					Редактировать
				</MenuItem>
			</MenuList>
		</Dropdown>
	);
};

export default PositionGroupDropdown;
