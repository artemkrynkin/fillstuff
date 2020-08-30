import React from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';

import PositionNameInList from './index';

import styles from './index.module.css';

const deliveryIsExpectedIconClasses = ClassNames({
	[styles.symbolIcon]: true,
	[styles.deliveryIsExpected]: true,
});

const isArchivedIconClasses = ClassNames({
	[styles.symbolIcon]: true,
	[styles.archive]: true,
});

const archivedAfterEndedIconClasses = ClassNames({
	[styles.symbolIcon]: true,
	[styles.archivedAfterEnded]: true,
});

const canceledIconClasses = ClassNames({
	[styles.symbolIcon]: true,
	[styles.writeOffUndo]: true,
});

const replacementIconClasses = ClassNames({
	[styles.symbolIcon]: true,
	[styles.positionReplacement]: true,
});

const Symbols = props => {
	const { deliveryIsExpected, isArchived, archivedAfterEnded, canceled, positionReplaced } = props;

	if (!deliveryIsExpected && !isArchived && !archivedAfterEnded && !canceled && !positionReplaced) return null;

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
			{positionReplaced ? (
				<Tooltip
					title={
						<>
							<b>Заменяемая позиция:</b>
							<PositionNameInList name={positionReplaced.name} characteristics={positionReplaced.characteristics} />
						</>
					}
					placement="top"
					interactive
				>
					<div className={replacementIconClasses}>
						<FontAwesomeIcon icon={['far-c', 'position-replacement']} />
					</div>
				</Tooltip>
			) : null}
		</div>
	);
};

export default Symbols;
