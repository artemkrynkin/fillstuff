import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { Dialog, DialogActions, DialogTitle } from 'src/components/Dialog';
import NumberFormat, { moneyInputFormatProps } from 'src/components/NumberFormat';
import Money from 'src/components/Money';
import AvatarTitle from 'src/components/AvatarTitle';

import { createInvoicePayment } from 'src/actions/invoices';

import stylesGlobal from 'src/styles/globals.module.css';
import styles from './index.module.css';

const invoicePaymentSchema = Yup.object().shape({
	amount: Yup.number()
		.min(0)
		.required(),
});

class DialogInvoicePaymentCreate extends Component {
	static propTypes = {
		dialogOpen: PropTypes.bool.isRequired,
		onCloseDialog: PropTypes.func.isRequired,
		onExitedDialog: PropTypes.func,
		selectedInvoice: PropTypes.object,
	};

	onSubmit = (values, actions) => {
		const { onCloseDialog, selectedInvoice } = this.props;
		const newValues = invoicePaymentSchema.cast(values);

		this.props.createInvoicePayment(selectedInvoice._id, newValues).then(response => {
			actions.setSubmitting(false);
			onCloseDialog();
		});
	};

	render() {
		const { dialogOpen, onCloseDialog, onExitedDialog, selectedInvoice } = this.props;

		if (!selectedInvoice) return null;

		return (
			<Dialog open={dialogOpen} onClose={onCloseDialog} onExited={onExitedDialog} maxWidth="md" scroll="body">
				<DialogTitle onClose={onCloseDialog}>
					Счет за {moment(selectedInvoice.fromDate).format('DD.MM.YYYY')} &ndash; {moment(selectedInvoice.toDate).format('DD.MM.YYYY')}
				</DialogTitle>
				<Formik
					initialValues={{ amount: '' }}
					validationSchema={invoicePaymentSchema}
					validateOnBlur={false}
					validateOnChange={false}
					onSubmit={(values, actions) => this.onSubmit(values, actions)}
				>
					{({ errors, isSubmitting, touched }) => (
						<Form>
							<DialogContent>
								<Grid className={styles.header} alignItems="center" container>
									<Grid xs={6} item>
										<AvatarTitle imageSrc={selectedInvoice.member.user.avatar} title={selectedInvoice.member.user.name} />
									</Grid>
									<Grid xs={6} item>
										<Grid alignItems="flex-end" justify="flex-start" direction="column" container>
											<div className={styles.totalPrice}>
												К оплате: <Money value={selectedInvoice.amount - selectedInvoice.paymentAmountDue} />
											</div>
										</Grid>
									</Grid>
								</Grid>
								<Grid className={stylesGlobal.formLabelControl}>
									<Field
										name="amount"
										label="Сумма к оплате"
										error={Boolean(touched.amount && errors.amount)}
										helperText={(touched.amount && errors.amount) || ''}
										as={TextField}
										InputProps={{
											inputComponent: NumberFormat,
											inputProps: {
												...moneyInputFormatProps,
											},
										}}
										fullWidth
										autoFocus
									/>
								</Grid>
							</DialogContent>
							<DialogActions
								leftHandleProps={{
									handleProps: {
										onClick: onCloseDialog,
									},
									text: 'Отмена',
								}}
								rightHandleProps={{
									handleProps: {
										type: 'submit',
										disabled: isSubmitting,
									},
									text: 'Принять оплату',
									isLoading: isSubmitting,
								}}
							/>
						</Form>
					)}
				</Formik>
			</Dialog>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		createInvoicePayment: (invoiceId, data) => dispatch(createInvoicePayment({ params: { invoiceId }, data })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogInvoicePaymentCreate);
