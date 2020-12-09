import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuList from '@material-ui/core/MenuList';
import MuiLink from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import { ACCOUNT_CLIENT_URL, ACCOUNT_SERVER_URL } from 'src/api/constants';

import Dropdown from 'src/components/Dropdown';
import Avatar from 'src/components/Avatar';
import MenuItem from 'src/components/MenuItem';

import { useStylesAvatar } from './styles';
import styles from './index.module.css';

const HelpPanel = props => {
	const { currentUser } = props;
	const refDropdownProfile = useRef(null);
	const [dropdownProfile, setDropdownProfile] = useState(false);
	const classesAvatar = useStylesAvatar(dropdownProfile);

	const onToggleDropdownProfile = value => setDropdownProfile(value === null || value === undefined ? prevValue => !prevValue : value);

	return (
		<div className={styles.container}>
			<span className={styles.containerShadow} />

			<Grid className={styles.wrapper} direction="column" justify="space-between" alignItems="center" container>
				<Link className={styles.logo} to="/" />
				<Tooltip title={currentUser.name}>
					<div className={styles.userAvatar} ref={refDropdownProfile} onClick={() => onToggleDropdownProfile()}>
						<Avatar classes={classesAvatar} src={currentUser.picture} />
					</div>
				</Tooltip>
			</Grid>

			<Dropdown
				anchor={refDropdownProfile}
				open={dropdownProfile}
				onClose={() => onToggleDropdownProfile(false)}
				placement="right-end"
				style={{ marginLeft: 10, width: 205 }}
			>
				<MenuList>
					<MenuItem
						href={ACCOUNT_CLIENT_URL}
						target="_blank"
						rel="noreferrer noopener"
						onClick={() => {
							onToggleDropdownProfile(false);
						}}
						iconAfter={<FontAwesomeIcon icon={['far', 'external-link']} size="sm" fixedWidth />}
						component={MuiLink}
					>
						Настройки аккаунта
					</MenuItem>
				</MenuList>
				<Divider />
				<MenuList>
					<MenuItem
						href={`${ACCOUNT_SERVER_URL}/auth/logout`}
						onClick={() => {
							onToggleDropdownProfile(false);
						}}
						component={MuiLink}
					>
						Выйти
					</MenuItem>
				</MenuList>
			</Dropdown>
		</div>
	);
};

export default HelpPanel;
