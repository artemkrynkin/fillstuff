import React from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';

import styles from './Symbols.module.css';

const deliveryIsExpectedIconClasses = ClassNames(styles.symbolIcon, styles.deliveryIsExpected);

const isArchivedIconClasses = ClassNames(styles.symbolIcon, styles.archive);

const archivedAfterEndedIconClasses = ClassNames(styles.symbolIcon, styles.archivedAfterEnded);

const canceledIconClasses = ClassNames(styles.symbolIcon, styles.writeOffUndo);

const childPositionIconClasses = ClassNames(styles.symbolIcon, styles.childPosition);

const Symbols = props => {
	const { badges } = props;

	if (!badges?.length) return null;

	return (
		<div className={styles.symbols}>
			{badges.some(badge => badge === 'archived') ? (
				<Tooltip title="Позиция архивирована" placement="top">
					<div className={isArchivedIconClasses}>
						<FontAwesomeIcon icon={['far', 'archive']} fixedWidth />
					</div>
				</Tooltip>
			) : null}
			{badges.some(badge => badge === 'archiving-after-ended') ? (
				<Tooltip
					title={<div style={{ textAlign: 'center', width: 200 }}>Архивируется после списания последней единицы</div>}
					placement="top"
				>
					<div className={archivedAfterEndedIconClasses}>
						<span className="fa-layers fa-fw" style={{ width: '16px' }}>
							<FontAwesomeIcon icon={['far', 'archive']} />
							<FontAwesomeIcon icon={['fas', 'circle']} transform="shrink-5 down-2.5 right-7" inverse />
							<FontAwesomeIcon icon={['fas', 'clock']} transform="shrink-7 down-2.5 right-7" />
						</span>
					</div>
				</Tooltip>
			) : null}
			{badges.some(badge => badge === 'canceled') ? (
				<Tooltip title="Списание отменено" placement="top">
					<div className={canceledIconClasses}>
						<FontAwesomeIcon icon={['far', 'undo']} fixedWidth />
					</div>
				</Tooltip>
			) : null}
			{badges.some(badge => badge === 'delivery-is-expected') ? (
				<Tooltip title="Ожидается доставка" placement="top">
					<div className={deliveryIsExpectedIconClasses}>
						<FontAwesomeIcon icon={['far', 'truck']} fixedWidth />
					</div>
				</Tooltip>
			) : null}
			{badges.some(badge => badge === 'replaceable') ? (
				<Tooltip
					title={
						<>
							Позиция на замену
							{/*{childPosition ? (*/}
							{/*  <PositionSummary name={childPosition.name} characteristics={childPosition.characteristics} />*/}
							{/*) : null}*/}
						</>
					}
					placement="top"
					interactive
				>
					<div className={childPositionIconClasses}>
						<FontAwesomeIcon icon={['far-c', 'position-replacement']} fixedWidth />
					</div>
				</Tooltip>
			) : null}
		</div>
	);
};

export default Symbols;
