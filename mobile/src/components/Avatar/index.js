import React from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { capitalize } from 'mobile/src/helpers/utils';

import styles from './styles';

function Avatar(props) {
	const { style, sourceUri, variant, fallbackIconColor, fallbackIconSize } = props;

	return (
		<View style={[!sourceUri ? styles.fallbackBorder : null, styles[`container${capitalize(variant)}`], styles.container, style]}>
			{sourceUri ? (
				<Image
					style={[styles[`picture${capitalize(variant)}`], styles.picture]}
					source={{
						uri: sourceUri,
					}}
				/>
			) : (
				<View style={styles.fallback}>
					<FontAwesomeIcon style={styles.fallbackIcon} icon={['fas', 'user']} color={fallbackIconColor} size={fallbackIconSize} />
				</View>
			)}
		</View>
	);
}

Avatar.defaultProps = {
	variant: 'circle',
	fallbackIconColor: 'white',
	fallbackIconSize: 25,
};

Avatar.propTypes = {
	style: PropTypes.object,
	sourceUri: PropTypes.string,
	variant: PropTypes.oneOf(['circle', 'rounded', 'square']),
	fallbackIconColor: PropTypes.string,
	fallbackIconSize: PropTypes.number,
};

export default Avatar;
