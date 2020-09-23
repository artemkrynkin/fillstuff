import React from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PositionSummary from 'src/components/PositionSummary';

import styles from './Position.module.css';

const Position = props => {
	const { selectedPositions, position, arrayHelpers, searchTextFieldPosition } = props;

	const selectedPositionIndex = selectedPositions.findIndex(selectedPosition => selectedPosition._id === position._id);

	const classesPositionItem = ClassNames(styles.checkbox, {
		[styles.checkboxActive]: Boolean(!!~selectedPositionIndex),
	});

	return (
		<div
			key={position._id}
			className={styles.positionItem}
			onClick={() => {
				searchTextFieldPosition.current.focus();

				if (!!~selectedPositionIndex) return arrayHelpers.remove(selectedPositionIndex);
				else return arrayHelpers.push(position);
			}}
		>
			<PositionSummary className={styles.positionSummary} name={position.name} characteristics={position.characteristics} avatar />
			<div className={classesPositionItem}>
				<FontAwesomeIcon icon={['far', 'check']} />
			</div>
		</div>
	);
};

export default Position;
