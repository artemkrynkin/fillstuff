import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuList from '@material-ui/core/MenuList';

import MenuItem from 'src/components/MenuItem';
import Dropdown from 'src/components/Dropdown';

const PositionDropdown = props => {
	const { refDropdownActions, dropdownActions, onToggleDropdownActions, position, onOpenDialogPosition, onArchivedAfterEnded } = props;

	return (
		<Dropdown
			anchor={refDropdownActions}
			open={dropdownActions}
			onClose={() => onToggleDropdownActions(false)}
			placement="bottom-end"
			disablePortal={false}
		>
			<MenuList>
				{!position.parentPosition ? (
					<MenuItem
						onClick={() => {
							onToggleDropdownActions();
							onOpenDialogPosition('dialogPositionQRCode', 'position', position);
						}}
						iconBefore={<FontAwesomeIcon icon={['far-c', 'qr-code']} fixedWidth />}
					>
						Печать QR-кода
					</MenuItem>
				) : null}
				<MenuItem
					onClick={() => {
						onToggleDropdownActions();
						onOpenDialogPosition('dialogPositionEdit', 'position', position);
					}}
					iconBefore={<FontAwesomeIcon icon={['far', 'pen']} fixedWidth />}
				>
					Редактировать
				</MenuItem>
				{position.positionGroup && !position.parentPosition ? (
					<MenuItem
						onClick={() => {
							onToggleDropdownActions();
							onOpenDialogPosition('dialogPositionRemoveFromGroup', 'position', position);
						}}
						iconBefore={<FontAwesomeIcon icon={['far', 'folder-minus']} fixedWidth />}
					>
						Открепить от группы
					</MenuItem>
				) : null}
				{position.childPosition || position.parentPosition ? (
					<MenuItem
						onClick={() => {
							onToggleDropdownActions();
							onOpenDialogPosition('dialogPositionDetach', 'position', position);
						}}
						iconBefore={<FontAwesomeIcon icon={['far-c', 'position-detach']} fixedWidth />}
					>
						Разъединить позицию
					</MenuItem>
				) : null}
				{position.archivedAfterEnded ? (
					<MenuItem
						onClick={() => {
							onToggleDropdownActions();
							onArchivedAfterEnded();
						}}
						iconBefore={
							<span className="fa-layers fa-fw" style={{ width: '16px' }}>
								<FontAwesomeIcon icon={['far', 'archive']} />
								<FontAwesomeIcon icon={['fas', 'circle']} transform="shrink-5 down-2.5 right-7" inverse />
								<FontAwesomeIcon icon={['fas', 'clock']} transform="shrink-7 down-2.5 right-7" />
							</span>
						}
					>
						Отменить архивирование
					</MenuItem>
				) : null}
				<MenuItem
					onClick={() => {
						onToggleDropdownActions();
						onOpenDialogPosition('dialogPositionArchiveDelete', 'position', position);
					}}
					iconBefore={
						position.hasReceipts ? (
							<FontAwesomeIcon icon={['far', 'archive']} fixedWidth />
						) : (
							<FontAwesomeIcon icon={['far', 'trash-alt']} fixedWidth />
						)
					}
					destructive
				>
					{position.hasReceipts ? 'Архивировать' : 'Удалить'}
				</MenuItem>
			</MenuList>
		</Dropdown>
	);
};

export default PositionDropdown;
