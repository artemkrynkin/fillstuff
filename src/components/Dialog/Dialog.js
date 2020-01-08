import React from 'react';
import PropTypes from 'prop-types';

import MuiDialog from '@material-ui/core/Dialog';

const Dialog = props => <MuiDialog transitionDuration={200} children={props.children} {...props} />;

Dialog.propTypes = {
	children: PropTypes.node,
};

export default Dialog;
