import React from 'react';

import MuiPopover from '@material-ui/core/Popover';
import Fade from '@material-ui/core/Fade';

const Popover = props => (
	<MuiPopover
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		TransitionComponent={Fade}
		transitionDuration={150}
		elevation={3}
		{...props}
	/>
);

export default Popover;
