import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';

import { Dialog, DialogTitle } from 'src/components/Dialog';

import { cancelProcurementExpected } from 'src/actions/procurements';
import { enqueueSnackbar } from 'src/actions/snackbars';

import { ButtonRed } from './styles';

const momentDate = moment();

const DialogProcurementExpectedCancel = props => {
	const { dialogOpen, onCloseDialog, onExitedDialog, selectedProcurement } = props;

	if (!selectedProcurement) return null;

	const isCurrentYear = momentDate.isSame(selectedProcurement.deliveryDate, 'year');
	const deliveryDate = moment(selectedProcurement.deliveryDate).format(isCurrentYear ? 'D MMMM' : 'D MMMM YYYY');
	const timeFrom = moment(selectedProcurement.deliveryTimeFrom).format('HH:mm');
	const timeTo = moment(selectedProcurement.deliveryTimeTo).format('HH:mm');

	const onSubmit = () => {
		props.cancelProcurementExpected(selectedProcurement._id).then(response => {
			onCloseDialog();

			if (response.status === 'success') props.getStudioStore();

			if (response.status === 'error') {
				this.props.enqueueSnackbar({
					message: response.message || 'Неизвестная ошибка.',
					options: {
						variant: 'error',
					},
				});
			}
		});
	};

	return (
		<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog}>
			<DialogTitle onClose={onCloseDialog} theme="noTheme">
				Отмена заказа
			</DialogTitle>
			<DialogContent>
				<Typography variant="body1">
					Вы&nbsp;действительно хотите отменить заказ из&nbsp;магазина <b>{selectedProcurement.shop.name}</b> запланированный на&nbsp;
					<b>
						{deliveryDate} с&nbsp;{timeFrom} до&nbsp;{timeTo}
					</b>
					?
				</Typography>
				<DialogActions>
					<ButtonRed onClick={onCloseDialog} variant="outlined" size="small">
						Отмена
					</ButtonRed>
					<ButtonRed onClick={onSubmit} variant="contained" color="primary" size="small">
						Отменить заказ
					</ButtonRed>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

DialogProcurementExpectedCancel.propTypes = {
	dialogOpen: PropTypes.bool.isRequired,
	onCloseDialog: PropTypes.func.isRequired,
	onExitedDialog: PropTypes.func,
	selectedProcurement: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
	return {
		cancelProcurementExpected: procurementId => dispatch(cancelProcurementExpected({ params: { procurementId } })),
		enqueueSnackbar: (...args) => dispatch(enqueueSnackbar(...args)),
	};
};

export default connect(null, mapDispatchToProps)(DialogProcurementExpectedCancel);
