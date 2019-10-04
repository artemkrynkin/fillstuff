import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.css';

const renderChipLabel = chip => chip;

const removeChip = (chips, index) => chips.splice(index, 1);

const Chips = props => {
	const { className, chips, onRenderChipLabel = renderChipLabel, onRemoveChip = removeChip } = props;

	let chipsClassesObj = {
		[styles.container]: true,
	};

	if (className)
		chipsClassesObj = {
			...Object.fromEntries(
				className
					.split(' ')
					.filter(val => val)
					.map(key => [key, true])
			),
			...chipsClassesObj,
		};

	const chipsClasses = ClassNames(chipsClassesObj);

	return (
		<div className={chipsClasses}>
			{chips.map((chip, index) => (
				<div className={styles.item} key={index}>
					<div className={styles.label} children={onRenderChipLabel(chip)} />
					<div className={styles.remove} onClick={() => onRemoveChip(chips, index)}>
						<FontAwesomeIcon icon={['far', 'times']} />
					</div>
				</div>
			))}
		</div>
	);
};

Chips.propTypes = {
	chips: PropTypes.array.isRequired,
	onRenderChipLabel: PropTypes.func,
	onRemoveChip: PropTypes.func,
};

export default Chips;
