import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import styles from './index.module.css';

const Empty = props => {
	const { imageSrc, imageSize, content, actions, className, style } = props;

	const containerClasses = ClassNames({
		...Object.fromEntries(
			className
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
	});

	const imageClasses = ClassNames({
		[styles.image]: true,
		[styles.imageMd]: imageSize === 'md',
		[styles.imageSm]: imageSize === 'sm',
	});

	return (
		<div className={containerClasses} style={style}>
			{imageSrc ? (
				<div className={imageClasses}>
					<img src={imageSrc} alt="" />
				</div>
			) : null}
			{content || actions ? (
				<div className={styles.content}>
					{content}
					{actions ? <div className={styles.actions}>{actions}</div> : null}
				</div>
			) : null}
		</div>
	);
};

Empty.defaultProps = {
	imageSize: 'md',
	className: '',
};

Empty.propTypes = {
	imageSrc: PropTypes.string,
	imageSize: PropTypes.oneOf(['md', 'sm']),
	content: PropTypes.node,
	actions: PropTypes.node,
	style: PropTypes.object,
	className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default Empty;
