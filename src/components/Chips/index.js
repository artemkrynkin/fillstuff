import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.styl';

const renderChipLabel = chip => chip;

const removeChip = (chips, index) => chips.splice(index, 1);

const Chips = props => {
	const { chips, onRenderChipLabel = renderChipLabel, onRemoveChip = removeChip } = props;

	return (
		<div className="chips">
			{chips.map((chip, index) => (
				<div className="chips__item" key={index}>
					<div className="chips__label" children={onRenderChipLabel(chip)} />
					<div className="chips__remove" onClick={() => onRemoveChip(chips, index)}>
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
