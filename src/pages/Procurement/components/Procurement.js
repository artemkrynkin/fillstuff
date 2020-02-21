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

import CardPaper from 'src/components/CardPaper';
import Money from 'src/components/Money';

import { getProcurement } from 'src/actions/procurements';

import Receipt from './Receipt';

import { TableCell } from './styles';
import styles from './Procurement.module.css';

class Procurement extends Component {
	state = {
		procurementData: null,
	};

	componentDidMount() {
		this.props.getProcurement().then(response => {
			if (response.status === 'success') {
				this.setState({ procurementData: response });
			} else {
				history.push({
					pathname: '/procurements',
				});
			}
		});
	}

	render() {
		const { procurementData } = this.state;

		if (!procurementData || !procurementData.data) return <div children={<CircularProgress size={20} />} style={{ textAlign: 'center' }} />;

		const { data: procurement } = procurementData;

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
									'Чек/накладная отсутствует'
								)}
							</div>
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
	const { procurementId } = ownProps;

	return {
		getProcurement: () => dispatch(getProcurement({ params: { procurementId } })),
	};
};

export default connect(null, mapDispatchToProps)(Procurement);
