import React from 'react';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Arrow = props => {
	const { onClick, direction } = props;

	let classes = ClassNames({
		'publication-card__slider-gallery-arrow': true,
		['publication-card__slider-gallery-arrow_' + direction]: true,
		'publication-card__slider-gallery-arrow_disabled': onClick === null,
	});

	return (
		<button className={classes} onClick={onClick}>
			<span>
				<FontAwesomeIcon icon={['fal', direction === 'prev' ? 'angle-left' : 'angle-right']} />
			</span>
		</button>
	);
};

export default Arrow;
