import React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './index.module.css';

function ButtonLoader({ loader, progressProps, children, ...remainingProps }) {
	return (
		<Button {...remainingProps}>
			{loader ? <CircularProgress {...progressProps} size={20} style={{ position: 'absolute' }} /> : null}
			<span className={styles.buttonText} style={{ opacity: Number(!loader) }}>
				{children}
			</span>
		</Button>
	);
}

export default ButtonLoader;
