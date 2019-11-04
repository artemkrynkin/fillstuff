import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const CheckboxWithLabel = ({ Label, ...remainingProps }) => <FormControlLabel control={<Checkbox {...remainingProps} />} {...Label} />;

export default CheckboxWithLabel;
