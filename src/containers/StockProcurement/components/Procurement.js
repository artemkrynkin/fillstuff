import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';

import { history } from 'src/helpers/history';

import NumberFormat, { currencyFormatProps } from 'src/components/NumberFormat';
import CardPaper from 'src/components/CardPaper';

import { getProcurement } from 'src/actions/procurements';

import Receipt from './Receipt';

import { TableCell } from './styles';
import styles from './Procurement.module.css';

class Procurement extends Component {
	state = {
		procurementData: null,
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
		const { procurementData } = this.state;

		if (!procurementData) return <div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />;

		const { data: procurement } = procurementData;

		if (procurementData)
			return (
				<CardPaper className={styles.container} header={false}>
					<div className={styles.wrapper}>
						<Grid className={styles.header} container>
							<Grid xs={6} item>
								<div className={styles.title}>
									{!procurement.noInvoice ? (
										<div>
											<span>№</span>
											{procurement.number} от {moment(procurement.date).format('DD.MM.YYYY')}
										</div>
									) : (
										<div>Закупка от {moment(procurement.createdAt).format('DD.MM.YYYY')}</div>
									)}
								</div>
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
										<Receipt key={index} receipt={receipt} />
									))}
								</TableBody>
							</Table>
						</div>
					</div>
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

export default connect(null, mapDispatchToProps)(Procurement);
