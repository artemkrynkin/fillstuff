import React, { useState } from 'react';

import ModalUserMenu from 'mobile/src/screens/Modals/UserMenu';
import ModalPositionWriteOff from 'mobile/src/screens/Modals/PositionWriteOff';
import ModalPositionGroup from 'mobile/src/screens/Modals/PositionGroup';

import { sleep } from 'mobile/src/helpers/utils';

import View from './View';

function Index(props) {
	const [cameraScanned, setCameraScanned] = useState(false);
	const [modalData, setModalData] = useState({
		position: null,
		positionGroup: null,
	});
	const [modals, setModals] = useState({
		modalUserMenu: false,
		modalPositionWriteOff: false,
		modalPositionGroup: false,
	});

	const onVisibleModalByName = (modalName, dataType, data) => {
		setModals(prevModals => {
			return {
				...prevModals,
				[modalName]: true,
			};
		});

		if (dataType && data) {
			setModalData(prevModalData => {
				return {
					...prevModalData,
					[dataType]: data,
				};
			});
		}
	};

	const onDisableModalByName = (modalName, dataType) => {
		setModals(prevModals => {
			return {
				...prevModals,
				[modalName]: false,
			};
		});

		if (dataType) {
			setModalData({
				...modalData,
				[dataType]: null,
			});
		}
	};

	return (
		<>
			<View
				modalData={modalData}
				modals={modals}
				onVisibleModalByName={onVisibleModalByName}
				cameraScanned={cameraScanned}
				setCameraScanned={setCameraScanned}
				{...props}
			/>

			<ModalUserMenu visible={modals.modalUserMenu} onClose={() => onDisableModalByName('modalUserMenu')} />
			<ModalPositionWriteOff
				visible={modals.modalPositionWriteOff}
				onClose={async () => {
					onDisableModalByName('modalPositionWriteOff', 'position');

					await sleep(400);

					setCameraScanned(false);
				}}
				position={modalData.position}
				setCameraScanned={setCameraScanned}
			/>
			<ModalPositionGroup
				visible={modals.modalPositionGroup}
				onClose={async () => {
					onDisableModalByName('modalPositionGroup', 'positionGroup');

					await sleep(400);

					setCameraScanned(false);
				}}
				positionGroup={modalData.positionGroup}
				onVisibleModalByName={onVisibleModalByName}
				onDisableModalByName={onDisableModalByName}
			/>
		</>
	);
}

export default Index;
