import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import styles from './index.module.css';

const AvatarTitle = props => {
	const { imageSrc, title, classNamesInitial, classNames, ...remainingProps } = props;
	const classNamesCombined = { ...classNamesInitial, ...classNames };

	const classesContainer = ClassNames({
		...Object.fromEntries(
			classNamesCombined.container
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
	});

	const classesImage = ClassNames({
		...Object.fromEntries(
			classNamesCombined.image
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.image]: true,
	});

	const classesTitle = ClassNames({
		...Object.fromEntries(
			classNamesCombined.title
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.title]: true,
	});

	return (
		<div className={classesContainer} {...remainingProps}>
			<Avatar className={classesImage} src={imageSrc} alt={title}>
				<div className={styles.userIcon}>
					<FontAwesomeIcon icon={['fas', 'user-alt']} />
				</div>
			</Avatar>
			{title ? (
				<Grid className={styles.details} alignItems="flex-end" container>
					<div className={classesTitle}>{title}</div>
				</Grid>
			) : null}
		</div>
	);
};

AvatarTitle.defaultProps = {
	classNamesInitial: {
		container: '',
		image: '',
		title: '',
	},
};

AvatarTitle.propTypes = {
	classNames: PropTypes.shape({
		container: PropTypes.string,
		image: PropTypes.string,
		title: PropTypes.string,
	}),
	imageSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	title: PropTypes.string,
};

export default AvatarTitle;
