import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MuiAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	sizeAvatarXs: {
		height: theme.spacing(3.5),
		width: theme.spacing(3.5),
	},
	sizeAvatarSm: {
		height: theme.spacing(4.5),
		width: theme.spacing(4.5),
	},
	sizeAvatarMd: {
		height: theme.spacing(6),
		width: theme.spacing(6),
	},
	sizeAvatarLg: {
		height: theme.spacing(9),
		width: theme.spacing(9),
	},
	sizeAvatarXl: {
		height: theme.spacing(14),
		width: theme.spacing(14),
	},
}));

const Avatar = props => {
	const { className, size, ...remainingProps } = props;
	const classes = useStyles();

	const avatarClasses = ClassNames(className, {
		[classes.sizeAvatarXs]: size === 'xs',
		[classes.sizeAvatarSm]: size === 'sm',
		[classes.sizeAvatarMd]: size === 'md',
		[classes.sizeAvatarLg]: size === 'lg',
		[classes.sizeAvatarXl]: size === 'xl',
	});

	return (
		<MuiAvatar
			children={<FontAwesomeIcon className="MuiAvatar-fallback" icon={['fas', 'user-alt']} />}
			{...remainingProps}
			className={avatarClasses}
		/>
	);
};

Avatar.defaultProps = {
	className: '',
	size: 'sm',
};

Avatar.propTypes = {
	className: PropTypes.string,
	alt: PropTypes.string,
	children: PropTypes.node,
	imgProps: PropTypes.object,
	sizes: PropTypes.string,
	src: PropTypes.string,
	srcSet: PropTypes.string,
	variant: PropTypes.oneOf(['circle', 'rounded', 'square']),
	size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

export default Avatar;
