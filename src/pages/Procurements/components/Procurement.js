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

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';

import Receipt from './Receipt';

import { TableCell } from './styles';
import styles from './Procurement.module.css';

const Procurement = props => {
	const { procurement, filterParams } = props;
	const [expanded, setExpanded] = useState(filterParams.position !== 'all');

	const onHandleExpand = event => {
		if (!event.target.classList.contains(styles.title)) setExpanded(!expanded);
	};

	return (
		<CardPaper className={styles.container} header={false}>
			<div className={styles.wrapper}>
				<div className={styles.header} onClick={onHandleExpand}>
					<Grid container>
						<Grid xs={6} item>
							<Link className={styles.title} to={`/procurements/${procurement._id}`}>
								{!procurement.noInvoice ? (
									<div>
										<span>№</span>
										{procurement.number} от {moment(procurement.date).format('DD.MM.YYYY')}
									</div>
								) : (
									'Чек/накладная отсутствует'
								)}
							</Link>
							<div className={styles.user}>
								<Avatar
									className={styles.userPhoto}
									src={procurement.member.user.avatar}
									alt={procurement.member.user.name}
									children={<div className={styles.userIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
								/>
								<Grid alignItems="flex-end" container>
									<div className={styles.userName}>{procurement.member.user.name}</div>
								</Grid>
							</div>
						</Grid>
						<Grid xs={6} item>
							<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
								<div className={styles.totalPrice}>
									Итого: <Money value={procurement.totalPrice} />
								</div>
								<div className={styles.pricePositions}>
									Стоимость позиций: <Money value={procurement.pricePositions} />
								</div>
								<div className={styles.costDelivery}>
									Стоимость доставки: <Money value={procurement.costDelivery} />
								</div>
							</Grid>
						</Grid>
					</Grid>
				</div>
				<Collapse in={expanded} timeout={300} unmountOnExit>
					<div className={styles.receipts}>
						<Table style={{ tableLayout: 'fixed' }}>
							<TableHead>
								<TableRow>
									<TableCell width={280}>Позиция</TableCell>
									<TableCell />
									<TableCell align="right" width={160}>
										Количество
									</TableCell>
									<TableCell align="right" width={140}>
										Цена покупки
									</TableCell>
									<TableCell align="right" width={140}>
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
