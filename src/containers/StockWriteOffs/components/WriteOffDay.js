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

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import CardPaper from 'src/components/CardPaper';

import WriteOff from './WriteOff';

import { TableCell } from './styles';
import styles from './WriteOffDay.module.css';

const WriteOffDay = props => {
	const { date, indicators, writeOffs } = props;
	const [expanded, setExpanded] = useState(moment(date).isSame(new Date(), 'day'));

	const onHandleExpand = event => {
		if (event.target.className !== styles.title) setExpanded(!expanded);
	};

	return (
		<CardPaper className={styles.container} header={false}>
			<div className={styles.wrapper}>
				<div className={styles.header} onClick={onHandleExpand}>
					<Grid container>
						<Grid xs={6} item />
						<Grid xs={6} item>
							<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
								<NumberFormat
									value={indicators.total}
									renderText={value => (
										<div className={styles.totalPurchasePrice}>
											Всего: <span>{value}</span>
										</div>
									)}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								<NumberFormat
									value={indicators.sellingPositions}
									renderText={value => (
										<div className={styles.purchasePrice}>
											По позициям для продажи: <span>{value}</span>
										</div>
									)}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								<NumberFormat
									value={indicators.freePositions}
									renderText={value => (
										<div className={styles.costDelivery}>
											По бесплатным позициям: <span>{value}</span>
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

export default WriteOffDay;
