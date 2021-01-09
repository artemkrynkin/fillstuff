import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import styles from './styles';

/**
 * avatar - Если true, будет показываться аватар
 *
 * name - Наименование позиции
 *
 * characteristics - характеристики позиции
 *
 * size - размер ( sm | md | lg )
 *
 */
function PositionSummary(props) {
	const { style, avatar, src, name, characteristics, size, ...remainingProps } = props;

	if (!name) return null;

	const stylesContainer = () => {
		return style ? [style, styles.container] : styles.container;
	};

	const stylesAvatar = () => {
		switch (size) {
			case 'lg':
				return [styles.avatar, styles.avatarLg];
			case 'md':
				return [styles.avatar, styles.avatarMd];
			case 'sm':
			default:
				return [styles.avatar, styles.avatarSm];
		}
	};

	const sizeFallbackIcon = () => {
		switch (size) {
			case 'lg':
				return 46;
			case 'md':
				return 38;
			case 'sm':
			default:
				return 32;
		}
	};

	const stylesName = () => {
		switch (size) {
			case 'lg':
				return [styles.name, styles.nameLg];
			case 'md':
				return [styles.name, styles.nameMd];
			case 'sm':
			default:
				return [styles.name, styles.nameSm];
		}
	};

	const stylesCharacteristics = () => {
		switch (size) {
			case 'lg':
				return [styles.characteristics, styles.characteristicsLg];
			case 'md':
				return [styles.characteristics, styles.characteristicsMd];
			case 'sm':
			default:
				return [styles.characteristics, styles.characteristicsSm];
		}
	};

	return (
		<View style={stylesContainer()} {...remainingProps}>
			{avatar ? (
				<View style={stylesAvatar()}>
					<FontAwesomeIcon style={styles.fallbackIcon} icon={['fad', 'box-alt']} size={sizeFallbackIcon()} />
				</View>
			) : null}
			<View style={styles.summary}>
				<Text style={stylesName()} numberOfLines={1}>
					{name}
				</Text>
				{characteristics?.length ? (
					<Text style={stylesCharacteristics()} numberOfLines={1}>
						{characteristics.reduce(
							(characteristics, characteristic) => (characteristics ? `${characteristics}, ` : '') + characteristic.name,
							''
						)}
					</Text>
				) : null}
			</View>
		</View>
	);
}

PositionSummary.defaultProps = {
	avatar: false,
	size: 'sm',
};

PositionSummary.propTypes = {
	avatar: PropTypes.bool,
	src: PropTypes.string,
	name: PropTypes.string.isRequired,
	characteristics: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})
	),
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default PositionSummary;
