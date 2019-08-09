import React from 'react';

import Popover from '@material-ui/core/Popover';

const CustomPopover = props => {
	return (
		<Popover
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			transitionDuration={150}
			elevation={3}
			{...props}
		/>
	);
};

export default CustomPopover;
