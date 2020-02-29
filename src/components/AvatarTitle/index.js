import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import styles from './index.module.css';

const AvatarTitle = props => {
	const { imageSrc, title } = props;

	return (
		<div className={styles.container}>
			<Avatar className={styles.image} src={imageSrc} alt={title}>
				<div className={styles.userIcon}>
					<FontAwesomeIcon icon={['fas', 'user-alt']} />
				</div>
			</Avatar>
			{title ? (
				<Grid className={styles.details} alignItems="flex-end" container>
					<div className={styles.title}>{title}</div>
				</Grid>
			) : null}
		</div>
	);
};

export default AvatarTitle;
