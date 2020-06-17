import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';

import styles from './index.module.css';

const PositionNameInList = props => {
	const { name, characteristics, deliveryIsExpected, isArchived, archivedAfterEnded, canceled, size, className, style } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
		[styles.sizeSm]: size === 'sm',
		[styles.sizeMd]: size === 'md',
		[styles.sizeLg]: size === 'lg',
	});

	return (
		<div className={classes} style={style}>
			<div className={styles.names}>
				<span className={styles.name}>{name}</span>
				{characteristics.length ? (
					<span className={styles.characteristics}>
						{characteristics.reduce((characteristics, characteristic) => `${characteristics}${characteristic.name} `, '').trim()}
					</span>
				) : null}
			</div>
			{deliveryIsExpected || isArchived || archivedAfterEnded || canceled ? (
				<div className={styles.symbols}>
					{deliveryIsExpected ? (
						<Tooltip title="Ожидается доставка" placement="top">
							<div className={styles.deliveryIsExpected}>
								<FontAwesomeIcon icon={['far', 'truck']} />
							</div>
						</Tooltip>
					) : null}
					{isArchived ? (
						<Tooltip title="Позиция архивирована" placement="top">
							<div className={styles.archive}>
								<FontAwesomeIcon icon={['far', 'archive']} />
							</div>
						</Tooltip>
					) : null}
					{archivedAfterEnded ? (
						<Tooltip title={<div style={{ width: 200 }}>Позиция архивируется после списания последней единицы</div>} placement="top">
							<div className={styles.archivedAfterEnded}>
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
							<div className={styles.writeOffUndo}>
								<FontAwesomeIcon icon={['far', 'undo']} />
							</div>
						</Tooltip>
					) : null}
				</div>
			) : null}
		</div>
	);
};

PositionNameInList.defaultProps = {
	className: '',
	isArchived: false,
	archivedAfterEnded: false,
	canceled: false,
	size: 'sm',
};

PositionNameInList.propTypes = {
	name: PropTypes.string.isRequired,
	characteristics: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})
	),
	isArchived: PropTypes.bool,
	archivedAfterEnded: PropTypes.bool,
	canceled: PropTypes.bool,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default PositionNameInList;
