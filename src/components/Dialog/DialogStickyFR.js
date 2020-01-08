import React, { forwardRef } from 'react';

import DialogSticky from './DialogSticky';

const DialogStickyFR = forwardRef((props, ref) => <DialogSticky innerRef={ref} {...props} />);

export default DialogStickyFR;
