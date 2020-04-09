import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';

import styles from './index.module.css';

const renderChipLabel = chip => chip;

const removeChip = (chips, chip, index) => chips.splice(index, 1);

const Chip = props => {
	const { chipLabel, onRemoveChip, disabled } = props;

	return (
		<div className={styles.item}>
			<div className={styles.label}>{chipLabel}</div>
			{onRemoveChip ? (
				<ButtonBase onClick={onRemoveChip} className={styles.remove} disabled={disabled}>
					<FontAwesomeIcon icon={['far', 'times']} />
				</ButtonBase>
			) : null}
		</div>
	);
};

Chip.propTypes = {
	chipLabel: PropTypes.node,
	onRemoveChip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	disabled: PropTypes.bool,
};

const Chips = props => {
	const { className, chips, onRenderChip, onRenderChipLabel, onRemoveChip, disabled } = props;

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
			{chips.map((chip, index) => {
				if (onRenderChip) return onRenderChip(chips, chip, index);

				return (
					<Chip
						key={index}
						chipLabel={onRenderChipLabel(chip)}
						onRemoveChip={onRemoveChip ? () => onRemoveChip(chips, index) : null}
						disabled={disabled}
					/>
				);
			})}
		</div>
	);
};

Chips.defaultProps = {
	className: '',
	onRenderChip: null,
	onRenderChipLabel: renderChipLabel,
	onRemoveChip: removeChip,
	disabled: false,
};

Chips.propTypes = {
	chips: PropTypes.array.isRequired,
	onRenderChip: PropTypes.func,
	onRenderChipLabel: PropTypes.func,
	onRemoveChip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	disabled: PropTypes.bool,
};

export default Chips;
