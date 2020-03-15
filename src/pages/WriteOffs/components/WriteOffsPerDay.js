import React, { useState } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';
import loadable from '@loadable/component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import { history } from 'src/helpers/history';

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';

import WriteOff from './WriteOff';

import { TableCell } from './styles';
import styles from './WriteOffsPerDay.module.css';
import queryString from 'query-string';

const DialogWriteOffCancel = loadable(() => import('src/pages/Dialogs/WriteOffCancel' /* webpackChunkName: "Dialog_WriteOffCancel" */));

const calendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	lastDay: 'Вчера',
	sameElse: 'D MMMM, dddd',
	nextWeek: 'D MMMM, dddd',
	lastWeek: 'D MMMM, dddd',
};

const WriteOffsPerDay = props => {
	const {
		writeOffsPerDay: { date, indicators, writeOffs },
	} = props;
	const [writeOff, setWriteOff] = useState(null);
	const [dialogWriteOffCancel, setDialogWriteOffCancel] = useState(false);
	const [expanded, setExpanded] = useState(moment(date).isSame(new Date(), 'day'));

	const onWriteOffDrop = () => {
		setWriteOff(null);
	};

	const onHandleDialogWriteOffCancel = (value, writeOff) => {
		if (value) setWriteOff(writeOff);

		setDialogWriteOffCancel(value);
	};

	const onHandleExpand = event => {
		if (!event.target.closest(`.${styles.usersPerDayWrapper}`)) setExpanded(!expanded);
	};

	const onChangeFilterRole = role => {
		const { filterParams } = props;

		const momentDate = moment();

		const query = { ...filterParams };

		query.role = role;

		Object.keys(query).forEach(key => (query[key] === '' || query[key] === 'all') && delete query[key]);

		if (momentDate.startOf('month').isSame(query.dateStart, 'day') && momentDate.endOf('month').isSame(query.dateEnd, 'day')) {
			delete query.dateStart;
			delete query.dateEnd;
		}

		history.replace({
			search: queryString.stringify(query),
		});
	};

	return (
		<CardPaper className={styles.container} header={false}>
			<div className={styles.wrapper}>
				<div className={styles.header} onClick={onHandleExpand}>
					<Grid container>
						<Grid xs={6} item>
							<div className={styles.title}>{moment(date).calendar(null, calendarFormat)}</div>
							<div>
								<div className={styles.usersPerDayWrapper}>
									{indicators.members.map((member, index) => (
										<Tooltip key={index} title={member.user.name} placement="top" arrow={false}>
											<div
												className={ClassNames({
													[styles.user]: true,
													[styles.userSingle]: indicators.members.length === 1,
												})}
												style={{ zIndex: indicators.members.length - index }}
												onClick={() => onChangeFilterRole(member._id)}
											>
												<Avatar
													className={styles.userPhoto}
													src={member.user.avatar}
													alt={member.user.name}
													children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
												/>
											</div>
										</Tooltip>
									))}
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
								</TableRow>
							</TableHead>
							<TableBody>
								{writeOffs.map(writeOff => (
									<WriteOff
										key={writeOff._id}
										writeOff={writeOff}
										onOpenDialogWriteOffCancel={() => onHandleDialogWriteOffCancel(true, writeOff)}
									/>
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

			<DialogWriteOffCancel
				dialogOpen={dialogWriteOffCancel}
				onCloseDialog={() => onHandleDialogWriteOffCancel(false)}
				onExitedDialog={onWriteOffDrop}
				selectedWriteOff={writeOff}
			/>
		</CardPaper>
	);
};

export default WriteOffsPerDay;
