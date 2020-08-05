import React, { useRef, useState } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';
import queryString from 'query-string';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import history from 'src/helpers/history';

import CardPaper from 'src/components/CardPaper';
import AvatarTitle from 'src/components/AvatarTitle';
import Money from 'src/components/Money';
import Dropdown from 'src/components/Dropdown';
import { deleteParamsCoincidence } from 'src/components/Pagination/utils';

import WriteOff from './WriteOff';

import { TableCell } from './styles';
import styles from './WriteOffsDay.module.css';

const calendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	lastDay: 'Вчера',
	sameElse: 'D MMMM, dddd',
	nextWeek: 'D MMMM, dddd',
	lastWeek: 'D MMMM, dddd',
};

const WriteOffsDay = props => {
	const {
		writeOffDay: { date, indicators, writeOffs },
		onOpenDialogByName,
	} = props;
	const refDropdownAllUsers = useRef(null);
	const [expanded, setExpanded] = useState(moment(date).isSame(new Date(), 'day'));
	const [dropdownAllUsers, setDropdownAllUsers] = useState(false);

	const maxVisibleUsers = 4;

	const onHandleDropdownAllUsers = () => setDropdownAllUsers(prevValue => !prevValue);

	const onHandleExpand = event => {
		if (!event.target.closest(`.${styles.users}`)) setExpanded(!expanded);
	};

	const onChangeFilterRole = role => {
		const {
			filterOptions: { params: filterParams, delete: filterDeleteParams },
		} = props;

		const query = deleteParamsCoincidence({ ...filterParams }, { type: 'server', ...filterDeleteParams });

		query.role = role;

		if (!query.onlyCanceled) delete query.onlyCanceled;

		history.replace({
			search: queryString.stringify(query),
		});
	};

	const isCurrentDay = moment()
		.subtract({ day: 1 })
		.isBefore(writeOffs[0].createdAt);

	return (
		<CardPaper className={styles.container} header={false}>
			<div className={styles.wrapper}>
				<div className={styles.header} onClick={onHandleExpand}>
					<Grid container>
						<Grid xs={6} item>
							<div className={styles.title}>{moment(date).calendar(null, calendarFormat)}</div>
							<div className={styles.usersContainer}>
								<div ref={refDropdownAllUsers} className={styles.users}>
									{indicators.members.map((member, index) => {
										if (index >= maxVisibleUsers) return null;

										return (
											<Tooltip key={member._id} title={member.user.name} placement="top" enterDelay={150} enterNextDelay={150}>
												<div className={styles.user} style={{ zIndex: indicators.members.length - index }}>
													<AvatarTitle
														onClick={() => onChangeFilterRole(member._id)}
														classNames={{
															image: styles.userPhoto,
														}}
														imageSrc={member.user.avatar}
													/>
												</div>
											</Tooltip>
										);
									})}
									{indicators.members.length > maxVisibleUsers ? (
										<div className={styles.remainingUsersButton} onClick={onHandleDropdownAllUsers}>
											{`+${indicators.members.length - maxVisibleUsers}`}
										</div>
									) : null}
								</div>
							</div>
						</Grid>
						<Grid xs={6} item>
							<Grid className={styles.indicators} alignItems="center" container>
								<Grid xs={6} item>
									<div className={styles.indicatorsTitle}>
										<Money value={indicators.turnover} />
									</div>
									<div className={styles.indicatorsSubtitle}>Оборот</div>
								</Grid>
								<Grid xs={6} item>
									<div className={styles.indicatorsTitle}>
										<Money value={indicators.expenses} />
									</div>
									<div className={styles.indicatorsSubtitle}>Расходы</div>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
				<Collapse in={expanded} timeout={300} unmountOnExit>
					<div className={styles.receipts}>
						<Table style={{ tableLayout: 'fixed' }}>
							<TableHead>
								<TableRow>
									<TableCell>Участник</TableCell>
									<TableCell>Позиция</TableCell>
									<TableCell align="right" width={115}>
										Количество
									</TableCell>
									<TableCell align="right" width={140}>
										Цена покупки
									</TableCell>
									<TableCell align="right" width={140}>
										Цена продажи
									</TableCell>
									<TableCell align="right" width={160}>
										Время
									</TableCell>
									{isCurrentDay ? <TableCell width={50} /> : null}
								</TableRow>
							</TableHead>
							<TableBody>
								{writeOffs.map(writeOff => (
									<WriteOff key={writeOff._id} writeOff={writeOff} isCurrentDay={isCurrentDay} onOpenDialogWriteOff={onOpenDialogByName} />
								))}
							</TableBody>
						</Table>
					</div>
				</Collapse>
				<ButtonBase
					className={ClassNames({
						[styles.detailsButton]: true,
						open: expanded,
					})}
					onClick={onHandleExpand}
					disableRipple
				>
					<FontAwesomeIcon icon={['far', 'angle-down']} className={expanded ? 'open' : ''} />
				</ButtonBase>
			</div>

			{indicators.members.length > maxVisibleUsers ? (
				<Dropdown
					anchor={refDropdownAllUsers}
					open={dropdownAllUsers}
					onClose={onHandleDropdownAllUsers}
					placement="bottom-start"
					disablePortal={false}
					style={{ margin: '-40px 0px 0px -8px' }}
					innerContentStyle={{ minWidth: 252, maxWidth: 386 }}
				>
					<div className={styles.allUsersPopup}>
						<IconButton className={styles.closePopup} onClick={onHandleDropdownAllUsers} size="small">
							<FontAwesomeIcon icon={['fal', 'times']} />
						</IconButton>
						<div className={styles.usersPopup}>
							{indicators.members.map(member => (
								<Tooltip key={member._id} title={member.user.name} placement="top">
									<div className={styles.userPopup}>
										<AvatarTitle onClick={() => onChangeFilterRole(member._id)} imageSrc={member.user.avatar} />
									</div>
								</Tooltip>
							))}
						</div>
					</div>
				</Dropdown>
			) : null}
		</CardPaper>
	);
};

export default WriteOffsDay;
