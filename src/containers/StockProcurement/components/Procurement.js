import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import moment from 'moment';
import validator from 'validator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { history } from 'src/helpers/history';

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import CardPaper from 'src/components/CardPaper';
import QuantityIndicator from 'src/components/QuantityIndicator';

import { getProcurement, editProcurement } from 'src/actions/procurements';

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
		commentEditable: false,
		newComment: '',
	};

	onHandleCommentEditable = () => {
		const {
			procurementData: { data: procurement },
			commentEditable,
		} = this.state;

		this.setState({ commentEditable: !commentEditable });

		if (!commentEditable) this.setState({ newComment: procurement.comment });
	};

	onSetNewComment = value =>
		this.setState({
			newComment: value,
		});

	onSaveNewComment = () => {
		const {
			procurementData: { data: procurement },
			newComment,
		} = this.state;

		this.props.editProcurement(procurement._id, { comment: newComment }).then(() => {
			const newProcurement = { ...procurement, comment: newComment };

			this.setState({
				procurementData: {
					data: newProcurement,
				},
			});

			this.onHandleCommentEditable();
		});
	};

	componentDidMount() {
		const { currentUser } = this.props;

		this.props.getProcurement().then(response => {
			if (response.status === 'success') {
				this.setState({
					procurementData: response,
					newComment: response.data.comment,
				});
			} else {
				history.push({
					pathname: `/stocks/${currentUser.activeStockId}/procurements`,
				});
			}
		});
	}

	render() {
		const { procurementData, commentEditable, newComment } = this.state;

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
					</Grid>
					<div className={styles.procurementComment}>
						<div className={styles.procurementCommentTitle}>Комментарий:</div>
						{!commentEditable ? (
							<div className={styles.procurementCommentContent} onClick={!commentEditable ? this.onHandleCommentEditable : null}>
								{procurement.comment ? procurement.comment : <span>Изменить комментарий</span>}
							</div>
						) : (
							<div>
								<TextField
									value={newComment}
									onChange={({ target: { value } }) => this.onSetNewComment(value)}
									onBlur={validator.equals(procurement.comment, newComment) ? this.onHandleCommentEditable : () => {}}
									rows={2}
									rowsMax={4}
									multiline
									fullWidth
									autoFocus
								/>
								<div>
									<Button variant="contained" size="small" style={{ marginRight: 8 }} onClick={this.onHandleCommentEditable}>
										Отмена
									</Button>
									<Button variant="contained" color="primary" size="small" style={{ marginRight: 8 }} onClick={this.onSaveNewComment}>
										Сохранить комментарий
									</Button>
								</div>
							</div>
						)}
					</div>
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
										{!receipt.position.isFree ? `${receipt.unitSellingPrice} ₽` : 'Бесплатно'}
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
		editProcurement: (procurementId, newValues) => dispatch(editProcurement(currentStock._id, procurementId, newValues)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(Procurement);
