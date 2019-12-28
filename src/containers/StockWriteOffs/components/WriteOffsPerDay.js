import React, { useState } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';

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

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import CardPaper from 'src/components/CardPaper';

import WriteOff from './WriteOff';

import { TableCell } from './styles';
import styles from './WriteOffsPerDay.module.css';

const calendarFormat = {
	sameDay: 'Сегодня',
	nextDay: 'Завтра',
	lastDay: 'Вчера',
	sameElse: 'DD MMMM, dddd',
	nextWeek: 'DD MMMM, dddd',
	lastWeek: 'DD MMMM, dddd',
};

const WriteOffsPerDay = props => {
	const {
		writeOffsPerDay: { date, indicators, items: writeOffs },
	} = props;
	const [expanded, setExpanded] = useState(moment(date).isSame(new Date(), 'day'));

	const onHandleExpand = event => {
		if (!event.target.closest(`.${styles.usersWhoMadeWriteOffs}`)) setExpanded(!expanded);
	};

	return (
		<CardPaper className={styles.container} header={false}>
			<div className={styles.wrapper}>
				<div className={styles.header} onClick={onHandleExpand}>
					<Grid container>
						<Grid xs={6} item>
							<div className={styles.title}>{moment(date).calendar(null, calendarFormat)}</div>
							<div>
								<div className={styles.usersWhoMadeWriteOffs}>
									{indicators.users.map((user, index) => (
										<Tooltip key={index} title={user.name} placement="top" arrow={false}>
											<div
												className={ClassNames({
													[styles.user]: true,
													[styles.userSingle]: indicators.users.length === 1,
												})}
												style={{ zIndex: indicators.users.length - index }}
											>
												<Avatar
													className={styles.userPhoto}
													src={user.profilePhoto}
													alt={user.name}
													children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
												/>
											</div>
										</Tooltip>
									))}
								</div>
							</div>
						</Grid>
						<Grid xs={6} item>
							<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
								<NumberFormat
									value={indicators.total}
									renderText={value => (
										<div className={styles.total}>
											Итого: <span>{value}</span>
										</div>
									)}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								<NumberFormat
									value={indicators.sellingPositions}
									renderText={value => (
										<div className={styles.sellingPositions}>
											Позиции для продажи: <span>{value}</span>
										</div>
									)}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								<NumberFormat
									value={indicators.freePositions}
									renderText={value => (
										<div className={styles.freePositions}>
											Бесплатные позиции: <span>{value}</span>
										</div>
									)}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
							</Grid>
						</Grid>
					</Grid>
				</div>
				<Collapse in={expanded} timeout={300} unmountOnExit>
					<div className={styles.receipts}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Наименование</TableCell>
									<TableCell align="left" width={180}>
										Участник
									</TableCell>
									<TableCell align="right" width={125}>
										Количество
									</TableCell>
									<TableCell align="right" width={150}>
										Время
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{writeOffs.map((writeOff, index) => (
									<WriteOff key={index} writeOff={writeOff} />
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
		</CardPaper>
	);
};

export default WriteOffsPerDay;
