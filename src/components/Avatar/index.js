import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MuiAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

import { capitalize } from 'src/helpers/utils';

const useStyles = makeStyles(theme => ({
	sizeXs: {
		height: theme.spacing(3.5),
		width: theme.spacing(3.5),
	},
	sizeSm: {
		height: theme.spacing(4.5),
		width: theme.spacing(4.5),
	},
	sizeMd: {
		height: theme.spacing(6),
		width: theme.spacing(6),
	},
	sizeLg: {
		height: theme.spacing(9),
		width: theme.spacing(9),
	},
	sizeXl: {
		height: theme.spacing(14),
		width: theme.spacing(14),
	},
}));

const Avatar = props => {
	const { className, size, ...remainingProps } = props;
	const classes = useStyles();

	const classesAvatar = ClassNames(className, classes[`size${capitalize(size)}`]);
	const classesIcon = ClassNames(props.classes?.fallback, classes.fallback, 'MuiAvatar-fallback');

	return (
		<MuiAvatar
			children={<FontAwesomeIcon className={classesIcon} icon={['fas', 'user-alt']} />}
			{...remainingProps}
			className={classesAvatar}
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
