import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import Avatar from 'src/components/Avatar';

import StudioSelectDropdown from './StudioSelectDropdown';
import { routes } from './routes';

import styles from './index.module.css';

const classesStudioItemAvatarFallback = ClassNames(styles.studioItemAvatarFallback, 'MuiAvatar-fallback');

function Sidebar(props) {
	const {
		currentUser,
		currentStudio,
		studios: {
			data: studios,
			// isFetching: isLoadingStudios,
			// error: errorStudios
		},
	} = props;
	const refDropdownStudios = useRef(null);
	const [dropdownStudios, setDropdownStudios] = useState(false);
	const [switchStudioLoading, setSwitchStudioLoading] = useState(false);

	const onToggleDropdownStudios = value => setDropdownStudios(value === null || value === undefined ? prevValue => !prevValue : value);

	const onToggleSwitchStudioLoading = value =>
		setSwitchStudioLoading(value === null || value === undefined ? prevValue => !prevValue : value);

	const classesStudio = ClassNames(styles.studioSelectButton, {
		[styles.studioSelectButtonActive]: dropdownStudios,
	});

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.logo} />
				{currentUser.settings.studio && currentUser.settings.member ? (
					<div className={styles.menu}>
						<Grid
							ref={refDropdownStudios}
							onClick={() => onToggleDropdownStudios()}
							className={classesStudio}
							alignItems="center"
							component="button"
							container
						>
							{switchStudioLoading ? <CircularProgress className={styles.switchStudioLoading} size={32} thickness={5} /> : null}
							<Avatar className={styles.studioItemAvatar} src={currentStudio.avatar} size="xs">
								<FontAwesomeIcon className={classesStudioItemAvatarFallback} icon={['fas', 'store']} />
							</Avatar>
							<div className={styles.studioItemName}>{currentStudio.name}</div>
							<FontAwesomeIcon className={styles.studioItemArrow} icon={['far', 'angle-down']} fixedWidth />
						</Grid>
						{routes.length &&
							routes.map((route, index) => (
								<NavLink
									key={index}
									className={styles.menuLink}
									activeClassName={styles.menuLink_active}
									to={route.path}
									exact={route.exact || false}
									strict={route.strict || false}
								>
									{route.icon}
									<span className={styles.menuText}>{route.name}</span>
								</NavLink>
							))}
					</div>
				) : null}
			</div>

			<StudioSelectDropdown
				refDropdownStudios={refDropdownStudios}
				dropdownStudios={dropdownStudios}
				onToggleDropdownStudios={onToggleDropdownStudios}
				switchStudioLoading={switchStudioLoading}
				onToggleSwitchStudioLoading={onToggleSwitchStudioLoading}
				currentStudio={currentStudio}
				allStudios={studios}
			/>
		</div>
	);
}

export default Sidebar;
