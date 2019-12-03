import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import QuantityIndicator from 'src/components/QuantityIndicator';

import { TableCell } from './styles';
import styles from './Procurement.module.css';

const Procurement = props => {
	const { currentUser, procurement } = props;
	const [expanded, setExpanded] = useState(false);

	const onHandleExpand = () => {
		setExpanded(!expanded);
	};

	return (
		<CardPaper className={styles.procurement} header={false}>
			<Grid container>
				<Grid xs={6} item>
					<Link className={styles.procurementNumber} to={`/stocks/${currentUser.activeStockId}/procurements/${procurement._id}`}>
						№{procurement.number} от {moment(procurement.date).format('DD.MM.YYYY')}
					</Link>
					<div className={styles.procurementUser}>
						<Avatar
							className={styles.procurementUserPhoto}
							src={procurement.user.profilePhoto}
							alt={procurement.user.name}
							children={<div className={styles.procurementUserIcon} children={<FontAwesomeIcon icon={['fas', 'user-alt']} />} />}
						/>
						<Grid alignItems="flex-end" container>
							<div className={styles.procurementUserName}>{procurement.user.name}</div>
						</Grid>
					</div>
					<ButtonBase onClick={onHandleExpand} className={styles.detailsButton} disableRipple>
						<span>Детали закупки</span>
						<FontAwesomeIcon icon={['far', 'angle-down']} className={expanded ? 'open' : ''} />
					</ButtonBase>
				</Grid>
				<Grid xs={6} item>
					<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
						<NumberFormat
							value={procurement.totalPurchasePrice}
							renderText={value => (
								<div className={styles.procurementTotalPurchasePrice}>
									Итого: <span>{value}</span>
								</div>
							)}
							displayType="text"
							onValueChange={() => {}}
							{...currencyFormatProps}
						/>
						<NumberFormat
							value={procurement.purchasePrice}
							renderText={value => (
								<div className={styles.procurementPurchasePrice}>
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
								<div className={styles.procurementCostDelivery}>
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
			<Collapse className={styles.procurementReceiptsCollapse} in={expanded} timeout={300} unmountOnExit>
				<div className={styles.procurementReceipts}>
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
								<TableRow key={index}>
									<TableCell>
										{receipt.position.name}{' '}
										{receipt.position.characteristics.reduce(
											(fullCharacteristics, characteristic) => `${fullCharacteristics} ${characteristic.label}`,
											''
										)}
										{receipt.position.isArchived ? <span className={styles.isArchived}>В архиве</span> : null}
									</TableCell>
									<TableCell align="right" width={160}>
										<QuantityIndicator
											type="receipt"
											unitReceipt={receipt.position.unitReceipt}
											unitIssue={receipt.position.unitIssue}
											receipts={[{ ...receipt.initial }]}
										/>
									</TableCell>
									<TableCell align="right" width={160}>
										{receipt.unitPurchasePrice} ₽
									</TableCell>
									<TableCell align="right" width={160}>
										{!receipt.position.isFree ? `${receipt.unitSellingPrice} ₽` : 'Бесплатно'}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Collapse>
		</CardPaper>
	);
};

export default Procurement;
