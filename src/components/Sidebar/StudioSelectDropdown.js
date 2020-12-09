import React, { lazy, Suspense, useRef, useState } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import history from 'src/helpers/history';

import MenuItem from 'src/components/MenuItem';
import Avatar from 'src/components/Avatar';
import Dropdown from 'src/components/Dropdown';

import { switchStudio } from 'src/actions/user';

import { FilterSearchTextField } from './styles';
import styles from './index.module.css';

const DialogStudioCreate = lazy(() => import('src/views/Dialogs/StudioCreate'));

const findStudioByFullName = (studio, searchText) => {
	const searchTextLowercase = String(searchText).toLowerCase();

	const studioName = studio.name.toLowerCase();

	return studioName.indexOf(searchTextLowercase) !== -1;
};

const classesStudioItemAvatarFallback = ClassNames(styles.studioItemAvatarFallback, 'MuiAvatar-fallback');

function StudioSelectDropdown(props) {
	const { refDropdownStudios, dropdownStudios, onToggleDropdownStudios, onToggleSwitchStudioLoading, currentStudio, allStudios } = props;
	const searchTextFieldStudios = useRef(null);
	const [searchTextStudios, setSearchTextStudios] = useState('');
	const [dialogs, setDialogs] = useState({
		dialogStudioCreate: false,
	});

	const onTypeSearchTextStudios = ({ target: { value } }) => setSearchTextStudios(value);

	const onClearSearchTextStudios = () => {
		setSearchTextStudios('');

		searchTextFieldStudios.current.focus();
	};

	const onOpenDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: true,
		});
	};

	const onCloseDialogByName = dialogName => {
		setDialogs({
			...dialogs,
			[dialogName]: false,
		});
	};

	const onSwitchStudio = async studioId => {
		try {
			onToggleDropdownStudios(false);
			onToggleSwitchStudioLoading(true);

			await props.switchStudio(studioId);

			onToggleSwitchStudioLoading(false);

			history.push('/');
		} catch (error) {
			onToggleSwitchStudioLoading(false);
		}
	};

	const studios = allStudios ? allStudios.data.filter(studio => findStudioByFullName(studio, searchTextStudios)) : null;

	return (
		<>
			<Dropdown
				anchor={refDropdownStudios}
				open={dropdownStudios}
				onClose={() => onToggleDropdownStudios(false)}
				placement="top"
				header={
					<div className={styles.dropdownStudiosHeader}>
						<FilterSearchTextField
							inputRef={searchTextFieldStudios}
							placeholder="Поиск студий"
							value={searchTextStudios}
							onChange={onTypeSearchTextStudios}
							fullWidth
						/>
						{searchTextStudios ? (
							<ButtonBase onClick={onClearSearchTextStudios} className={styles.filterSearchTextFieldClear} tabIndex={-1}>
								<FontAwesomeIcon icon={['fal', 'times']} />
							</ButtonBase>
						) : null}
					</div>
				}
				footer={
					<MenuList className={styles.dropdownStudiosFooter}>
						<MenuItem
							onClick={() => {
								onToggleDropdownStudios(false);
								onOpenDialogByName('dialogStudioCreate');
							}}
							iconBefore={<FontAwesomeIcon icon={['far', 'plus']} fixedWidth />}
							tabIndex={0}
						>
							Создать студию
						</MenuItem>
					</MenuList>
				}
				style={{ marginTop: 10 }}
				innerContentStyle={{ width: 220, maxHeight: 300, overflow: 'auto' }}
			>
				{studios?.length ? (
					<MenuList autoFocusItem={dropdownStudios && !searchTextFieldStudios.current}>
						{studios.map((studio, index) => (
							<MenuItem key={index} selected={currentStudio?._id === studio._id} onClick={() => onSwitchStudio(studio._id)} tabIndex={0}>
								<Grid alignItems="center" container>
									<Avatar className={styles.studioItemAvatar} src={studio.avatar}>
										<FontAwesomeIcon className={classesStudioItemAvatarFallback} icon={['fas', 'store']} />
									</Avatar>
									<div className={styles.studioItemName}>{studio.name}</div>
								</Grid>
							</MenuItem>
						))}
					</MenuList>
				) : (
					<div style={{ textAlign: 'center', padding: 15 }}>
						{!studios?.length && searchTextStudios ? (
							<Typography variant="caption">Ничего не найдено</Typography>
						) : (
							<CircularProgress size={20} />
						)}
					</div>
				)}
			</Dropdown>

			<Suspense fallback={null}>
				<DialogStudioCreate dialogOpen={dialogs.dialogStudioCreate} onCloseDialog={() => onCloseDialogByName('dialogStudioCreate')} />
			</Suspense>
		</>
	);
}

const mapDispatchToProps = dispatch => {
	return {
		switchStudio: studioId => dispatch(switchStudio({ data: { studioId } })),
	};
};

export default connect(null, mapDispatchToProps)(StudioSelectDropdown);
