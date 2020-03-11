import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.css';

const renderChipLabel = chip => chip;

const removeChip = (chips, index) => chips.splice(index, 1);

const Chip = props => {
	const { chipLabel, onRemoveChip } = props;

	return (
		<div className={styles.item}>
			<div className={styles.label}>{chipLabel}</div>
			{onRemoveChip ? (
				<div className={styles.remove} onClick={onRemoveChip}>
					<FontAwesomeIcon icon={['far', 'times']} />
				</div>
			) : null}
		</div>
	);
};

Chip.propTypes = {
	chipLabel: PropTypes.node.isRequired,
	onRemoveChip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

const Chips = props => {
	const { className, chips, onRenderChipLabel, onRemoveChip } = props;

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
		<div className={classes}>
			{chips.map((chip, index) => (
				<Chip key={index} chipLabel={onRenderChipLabel(chip)} onRemoveChip={onRemoveChip ? () => onRemoveChip(chips, index) : null} />
			))}
		</div>
	);
};

Chips.defaultProps = {
	className: '',
	onRenderChipLabel: renderChipLabel,
	onRemoveChip: removeChip,
};

Chips.propTypes = {
	chips: PropTypes.array.isRequired,
	onRenderChipLabel: PropTypes.func.isRequired,
	onRemoveChip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default Chips;
