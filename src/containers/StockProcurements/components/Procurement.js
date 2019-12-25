import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import CardPaper from 'src/components/CardPaper';

import Receipt from './Receipt';

import { TableCell } from './styles';
import styles from './Procurement.module.css';

const Procurement = props => {
	const { procurement, currentUser, filterParams } = props;
	const [expanded, setExpanded] = useState(filterParams.position !== 'all');

	const onHandleExpand = event => {
		if (event.target.className !== styles.title) setExpanded(!expanded);
	};

	return (
		<CardPaper className={styles.container} header={false}>
			<div className={styles.wrapper}>
				<div className={styles.header} onClick={onHandleExpand}>
					<Grid container>
						<Grid xs={6} item>
							<Link className={styles.title} to={`/stocks/${currentUser.activeStockId}/procurements/${procurement._id}`}>
								{!procurement.noInvoice ? (
									<div>
										<span>№</span>
										{procurement.number} от {moment(procurement.date).format('DD.MM.YYYY')}
									</div>
								) : (
									<div>Закупка от {moment(procurement.createdAt).format('DD.MM.YYYY')}</div>
								)}
							</Link>
							<div className={styles.user}>
								<Avatar
									className={styles.userPhoto}
									src={procurement.user.profilePhoto}
									alt={procurement.user.name}
									children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
								/>
								<Grid alignItems="flex-end" container>
									<div className={styles.userName}>{procurement.user.name}</div>
								</Grid>
							</div>
						</Grid>
						<Grid xs={6} item>
							<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
								<NumberFormat
									value={procurement.totalPrice}
									renderText={value => (
										<div className={styles.totalPrice}>
											Итого: <span>{value}</span>
										</div>
									)}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								<NumberFormat
									value={procurement.pricePositions}
									renderText={value => (
										<div className={styles.pricePositions}>
											Стоимость позиций: <span>{value}</span>
										</div>
									)}
									displayType="text"
									onValueChange={() => {}}
									{...currencyFormatProps}
								/>
								<NumberFormat
									value={procurement.costDelivery}
									renderText={value => (
										<div className={styles.costDelivery}>
											Стоимость доставки: <span>{value}</span>
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
									<TableCell align="right" width={160}>
										Количество
									</TableCell>
									<TableCell align="right" width={160}>
										Цена покупки
									</TableCell>
									<TableCell align="right" width={160}>
										Цена продажи
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{procurement.receipts.map((receipt, index) => (
									<Receipt key={index} receipt={receipt} positionSameFilter={receipt.position._id === filterParams.position} />
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

export default Procurement;
