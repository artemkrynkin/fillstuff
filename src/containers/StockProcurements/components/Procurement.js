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

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import CardPaper from 'src/components/CardPaper';
import QuantityIndicator from 'src/components/QuantityIndicator';

import { TableCell } from './styles';
import styles from './Procurement.module.css';

const photoImgClasses = user =>
	ClassNames({
		[styles.procurementUserPhoto]: true,
		[styles.procurementUserPhotoNull]: user.isWaiting || !user.profilePhoto,
	});

const Procurement = props => {
	const { currentUser, procurement } = props;
	const [expanded, setExpanded] = useState(false);

	const onHandleExpand = () => {
		setExpanded(!expanded);
	};

	return (
		<CardPaper className={styles.procurement} header={false}>
			<Grid className={styles.procurementHeader} container>
				<Grid xs={6} item>
					<Link className={styles.procurementNumber} to={`/stocks/${currentUser.activeStockId}/procurements/${procurement._id}`}>
						№{procurement.number}
					</Link>
					<Grid alignItems="center" container>
						<div className={styles.procurementCreatedDate}>{moment(procurement.createdAt).format('DD.MM.YYYY в HH:mm')}</div>
						<div className={styles.procurementUser}>
							<div className={photoImgClasses(procurement.user)}>
								{procurement.user.profilePhoto ? (
									<img src={procurement.user.profilePhoto} alt="" />
								) : (
									<FontAwesomeIcon icon={['fas', 'user-alt']} />
								)}
							</div>
							<div className={styles.procurementUserName}>{procurement.user.name || procurement.user.email || 'Аноним'}</div>
						</div>
					</Grid>
				</Grid>
				<Grid xs={6} item></Grid>
			</Grid>
			{procurement.comment ? (
				<div className={styles.procurementComment}>
					<div className={styles.procurementCommentTitle}>Комментарий:</div>
					<div className={styles.procurementCommentContent}>{procurement.comment}</div>
				</div>
			) : null}
			<Grid className={styles.procurementTotal} container>
				<Grid xs={6} item>
					<Grid style={{ height: '100%' }} container>
						<ButtonBase onClick={onHandleExpand} className={styles.filterButtonLink} style={{ marginTop: 'auto' }} disableRipple>
							<span>Детали закупки</span>
							<FontAwesomeIcon icon={['far', 'angle-down']} className={expanded ? 'open' : ''} />
						</ButtonBase>
					</Grid>
				</Grid>
				<Grid xs={6} item>
					<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
						<NumberFormat
							value={procurement.totalPurchasePrice}
							renderText={value => (
								<div className={styles.procurementTotalPurchasePrice}>
									Сумма закупки: <span>{value}</span>
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
									Стоимость закупки: <span>{value}</span>
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
			<Collapse in={expanded} timeout={300} unmountOnExit>
				<Table className={styles.procurementReceipts}>
					<TableHead>
						<TableRow>
							<TableCell>Наименование</TableCell>
							<TableCell align="right" width={160}>
								Количество
							</TableCell>
							<TableCell align="right" width={160}>
								Цена закупки
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
									{receipt.unitSellingPrice} ₽
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Collapse>
		</CardPaper>
	);
};

export default Procurement;
