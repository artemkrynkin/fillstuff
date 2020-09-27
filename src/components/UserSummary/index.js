import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import Grid from '@material-ui/core/Grid';

import { capitalize } from 'src/helpers/utils';

import Avatar from 'src/components/Avatar';

import styles from './index.module.css';

const UserSummary = props => {
	const { className, url, avatar, src, title, titleWeight, subtitle, subtitleWeight, size, ...remainingProps } = props;

	if (!title) return null;

	const classesContainer = ClassNames(className, styles.container, styles[`size${capitalize(size)}`]);
	const classesTitle = ClassNames(styles.title, { [styles.withoutSubtitle]: !subtitle });

	return (
		<div className={classesContainer} {...remainingProps}>
			{avatar ? <Avatar className={styles.avatar} src={src} size={size} /> : null}
			<Grid className={styles.summary} direction="column" container>
				<div className={classesTitle} style={titleWeight && { fontWeight: titleWeight }}>
					{title}
				</div>
				{subtitle && size !== 'xs' ? (
					<div className={styles.subtitle} style={subtitleWeight && { fontWeight: subtitleWeight }}>
						{subtitle}
					</div>
				) : null}
			</Grid>
		</div>
	);
};

UserSummary.defaultProps = {
	className: '',
	avatar: true,
	size: 'sm',
};

UserSummary.propTypes = {
	className: PropTypes.string,
	avatar: PropTypes.bool,
	src: PropTypes.string,
	title: PropTypes.node.isRequired,
	titleWeight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
	subtitle: PropTypes.node,
	subtitleWeight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
	size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

export default UserSummary;
