import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

import { history } from 'src/helpers/history';

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import CardPaper from 'src/components/CardPaper';
import QuantityIndicator from 'src/components/QuantityIndicator';

import { getProcurement } from 'src/actions/procurements';

import { TableCell } from './styles';
import styles from './Procurement.module.css';

const photoImgClasses = user =>
	ClassNames({
		[styles.procurementUserPhoto]: true,
		[styles.procurementUserPhotoNull]: user.isWaiting || !user.profilePhoto,
	});

class Procurement extends Component {
	state = {
		procurementData: null,
	};

	componentDidMount() {
		const { currentUser } = this.props;

		this.props.getProcurement().then(response => {
			if (response.status === 'success') {
				this.setState({ procurementData: response });
			} else {
				history.push({
					pathname: `/stocks/${currentUser.activeStockId}/procurements`,
				});
			}
		});
	}

	render() {
		const { procurementData } = this.state;

		if (!procurementData) return <div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />;

		const { data: procurement } = procurementData;

		if (procurementData)
			return (
				<CardPaper className={styles.procurement} header={false}>
					<Grid className={styles.procurementHeader} container>
						<Grid xs={6} item>
							<div className={styles.procurementNumber}>№{procurement.number}</div>
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
								<div className={styles.procurementDetails}>Детали закупки</div>
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
									value={procurement.purchasePricePositions}
									renderText={value => (
										<div className={styles.procurementPurchasePricePositions}>
											Позиций на сумму: <span>{value}</span>
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
				</CardPaper>
			);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { currentStock, procurementId } = ownProps;

	return {
		getProcurement: () => dispatch(getProcurement(currentStock._id, procurementId)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Procurement);
