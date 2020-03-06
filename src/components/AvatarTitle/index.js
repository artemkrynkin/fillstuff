import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import styles from './index.module.css';

const AvatarTitle = props => {
	const { imageSrc, title, className } = props;

	const classes = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
	});

	return (
		<div className={classes}>
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

AvatarTitle.defaultProps = {
	className: '',
};

AvatarTitle.propTypes = {
	imageSrc: PropTypes.oneOf(PropTypes.string, PropTypes.object),
	title: PropTypes.string,
};

export default AvatarTitle;
