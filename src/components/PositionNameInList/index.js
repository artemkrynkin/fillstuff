import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';

import styles from './index.module.css';

const PositionNameInList = props => {
	const { name, characteristics, isArchived, canceled, className, style } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
	});

	return (
		<div className={classes} style={style}>
			<div className={styles.names}>
				<div className={styles.name}>{name}</div>
				{characteristics.length ? (
					<div className={styles.characteristics}>
						{characteristics.reduce((characteristics, characteristic) => `${characteristics}${characteristic.label} `, '').trim()}
					</div>
				) : null}
			</div>
			{isArchived || canceled ? (
				<div className={styles.symbols}>
					{canceled ? (
						<Tooltip title="Списание отменено" placement="top">
							<div className={styles.writeOffUndo}>
								<FontAwesomeIcon icon={['far', 'undo']} />
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
				</div>
			) : null}
		</div>
	);
};

PositionNameInList.defaultProps = {
	className: '',
	isArchived: false,
	canceled: false,
};

PositionNameInList.propTypes = {
	name: PropTypes.string.isRequired,
	characteristics: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	),
	isArchived: PropTypes.bool,
	canceled: PropTypes.bool,
};

export default PositionNameInList;
