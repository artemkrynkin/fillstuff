import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import styles from './index.module.css';

export const DefinitionList = props => {
	const { children, ...remainingProps } = props;

	return (
		<div className={styles.list} {...remainingProps}>
			{children}
		</div>
	);
};

export const DefinitionListItem = props => {
	const { term, value, termContainerStyle, definitionContainerStyle, dotsShow } = props;

	return (
		<Grid className={styles.definitionItem} alignItems="baseline" container>
			<Grid className={styles.termContainer} alignItems="baseline" style={termContainerStyle} container>
				<div className={styles.term} title={/string|number/.test(typeof term) ? term : null}>
					{term}
				</div>
				{dotsShow ? <div className={styles.dots} /> : null}
			</Grid>
			<dd className={styles.definitionContainer} title={/string|number/.test(typeof value) ? value : null} style={definitionContainerStyle}>
				<div className={styles.definitionValue}>{value}</div>
			</dd>
		</Grid>
	);
};

DefinitionListItem.defaultProps = {
	dotsShow: true,
};

DefinitionListItem.propTypes = {
	term: PropTypes.node.isRequired,
	value: PropTypes.node.isRequired,
	termContainerStyle: PropTypes.object,
	definitionContainerStyle: PropTypes.object,
	dotsShow: PropTypes.bool,
};
