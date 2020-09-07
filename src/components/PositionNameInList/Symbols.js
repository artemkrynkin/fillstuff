import React from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';

import PositionNameInList from './index';

import styles from './index.module.css';

const deliveryIsExpectedIconClasses = ClassNames(styles.symbolIcon, styles.deliveryIsExpected);

const isArchivedIconClasses = ClassNames(styles.symbolIcon, styles.archive);

const archivedAfterEndedIconClasses = ClassNames(styles.symbolIcon, styles.archivedAfterEnded);

const canceledIconClasses = ClassNames(styles.symbolIcon, styles.writeOffUndo);

const childPositionIconClasses = ClassNames(styles.symbolIcon, styles.childPosition);

const Symbols = props => {
	const { deliveryIsExpected, isArchived, archivedAfterEnded, canceled, childPosition } = props;

	if (!deliveryIsExpected && !isArchived && !archivedAfterEnded && !canceled && !childPosition) return null;

	return (
		<div className={styles.symbols}>
			{deliveryIsExpected ? (
				<Tooltip title="Ожидается доставка" placement="top">
					<div className={deliveryIsExpectedIconClasses}>
						<FontAwesomeIcon icon={['far', 'truck']} />
					</div>
				</Tooltip>
			) : null}
			{isArchived ? (
				<Tooltip title="Позиция архивирована" placement="top">
					<div className={isArchivedIconClasses}>
						<FontAwesomeIcon icon={['far', 'archive']} />
					</div>
				</Tooltip>
			) : null}
			{archivedAfterEnded ? (
				<Tooltip title={<div style={{ width: 200 }}>Позиция архивируется после списания последней единицы</div>} placement="top">
					<div className={archivedAfterEndedIconClasses}>
						<span className="fa-layers fa-fw" style={{ width: '16px' }}>
							<FontAwesomeIcon icon={['far', 'archive']} />
							<FontAwesomeIcon icon={['fas', 'circle']} transform="shrink-5 down-2.5 right-7" inverse />
							<FontAwesomeIcon icon={['fas', 'clock']} transform="shrink-7 down-2.5 right-7" />
						</span>
					</div>
				</Tooltip>
			) : null}
			{canceled ? (
				<Tooltip title="Списание отменено" placement="top">
					<div className={canceledIconClasses}>
						<FontAwesomeIcon icon={['far', 'undo']} />
					</div>
				</Tooltip>
			) : null}
			{childPosition ? (
				<Tooltip
					title={
						<>
							<b>Заменяемая позиция:</b>
							<PositionNameInList name={childPosition.name} characteristics={childPosition.characteristics} />
						</>
					}
					placement="top"
					interactive
				>
					<div className={childPositionIconClasses}>
						<FontAwesomeIcon icon={['far-c', 'position-replacement']} />
					</div>
				</Tooltip>
			) : null}
		</div>
	);
};

export default Symbols;
