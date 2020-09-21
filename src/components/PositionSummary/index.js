import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import Symbols from './Symbols';

import styles from './index.module.css';

const PositionSummary = props => {
	const { name, characteristics, minHeight, size, className, style, ...remainingProps } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
		[styles.minHeight]: minHeight && size === 'sm',
		[styles.sizeSm]: size === 'sm',
		[styles.sizeMd]: size === 'md',
		[styles.sizeLg]: size === 'lg',
	});

	return (
		<div className={classes} style={style}>
			<div className={styles.names}>
				{size === 'sm' ? (
					<div className={styles.name}>{name}</div>
				) : (
					<div className={styles.nameWithSymbols}>
						<span className={styles.name}>{name}</span>
						<Symbols {...remainingProps} />
					</div>
				)}
				{characteristics?.length ? (
					<div className={styles.characteristics}>
						{characteristics.reduce(
							(characteristics, characteristic) => (characteristics ? `${characteristics}, ` : '') + characteristic.name,
							''
						)}
					</div>
				) : null}
			</div>
			{size === 'sm' ? <Symbols {...remainingProps} /> : null}
		</div>
	);
};

PositionSummary.defaultProps = {
	className: '',
	isArchived: false,
	archivedAfterEnded: false,
	canceled: false,
	childPosition: null,
	minHeight: true,
	size: 'sm',
};

PositionSummary.propTypes = {
	className: PropTypes.string,
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
	replacement: PropTypes.object,
	minHeight: PropTypes.bool,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default PositionSummary;
