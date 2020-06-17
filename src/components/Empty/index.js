import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import styles from './index.module.css';

const Empty = props => {
	const { imageSrc, imageSize, content, actions, style } = props;
	const classNames = { ...props.classNamesInitial, ...props.classNames };

	const containerClasses = ClassNames({
		...Object.fromEntries(
			classNames.container
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.container]: true,
	});
	const imageClasses = ClassNames({
		...Object.fromEntries(
			classNames.image
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.image]: true,
		[styles.imageMd]: imageSize === 'md',
		[styles.imageSm]: imageSize === 'sm',
		[styles.imageXs]: imageSize === 'xs',
	});
	const contentClasses = ClassNames({
		...Object.fromEntries(
			classNames.content
				.split(' ')
				.filter(val => val)
				.map(key => [key, true])
		),
		[styles.content]: true,
	});

	return (
		<div className={containerClasses} style={style}>
			{imageSrc ? (
				<div className={imageClasses}>
					<img src={imageSrc} alt="" />
				</div>
			) : null}
			{content || actions ? (
				<div className={contentClasses}>
					{content}
					{actions ? <div className={styles.actions}>{actions}</div> : null}
				</div>
			) : null}
		</div>
	);
};

Empty.defaultProps = {
	imageSize: 'md',
	classNamesInitial: {
		container: '',
		image: '',
		content: '',
	},
};

Empty.propTypes = {
	imageSrc: PropTypes.string,
	imageSize: PropTypes.oneOf(['md', 'sm', 'xs', '']),
	content: PropTypes.node,
	actions: PropTypes.node,
	style: PropTypes.object,
	classNames: PropTypes.shape({
		container: PropTypes.string,
		image: PropTypes.string,
		content: PropTypes.string,
	}),
};

export default Empty;
